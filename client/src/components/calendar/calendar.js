import React, { lazy, useContext, useEffect, useRef, useState } from 'react'
import frLocal from '@fullcalendar/core/locales/fr'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios'
import moment from 'moment'
import { AuthContext } from '../../contexts/auth'
import SelectModal from '../modal/selectModal'
import ClickModal from '../modal/clickModal'
import Modal from '../modal/modal'
import { useSnackbar } from 'notistack'
import { Container } from '../styles/generalStyles'
import {
  addDataToIDBStore, countIDBData,
  getAllIDBStoreData,
  removeObjectFromStore,
  updateIDBData,
} from '../../utils/indexedDB'
import useDetectDevice from '../../hooks/useDetectDevice'
import useWindowSize from '../../hooks/useWindowSize'

import './calendar.css'

const CalendarDoc = lazy(() => import('./calendarDoc'))

export default function Calendar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const { user, isLoggedIn } = useContext(AuthContext)

  const windowSize = useWindowSize()

  const [ev, setEv] = useState([])
  const [isSelectModalOpen, setSelectModalIsOpen] = useState(false)
  const [isClickModalOpen, setClickModalIsOpen] = useState(false)
  const [eventDates, setEventDates] = useState({})
  const [selectEventInfo, setSelectedEventInfo] = useState({})

  const updateEventState = (event, params) => ev.map(ev => {
    if (Number(ev.id) === Number(event.id)) {
      return {
        ...ev,
        ...params,
      }
    }
    else {
      return ev
    }
  })

  //  TODO => Plus besoin de switch entre user mais on doit pouvoir switch entre "shared" et "perso"
  useEffect(() => {
    async function getEvents() {
      if (!isLoggedIn) {
        return JSON.parse(localStorage.getItem('userEvents'))
      }
      else {
        const res = await axios.get('/me/events')

        if (res.status === 200 || res.data.status === 'success') {
          return {
            events: res.data.events,
          }
        }
      }
    }

    // TODO : if (user) non nécessaire ? Utiliser isLoggedIn et !isLoggedIn ?
    if (user && isLoggedIn) {
      getEvents()
        .then(res => {
          setEv(res.events/* || Array(res)*/)
        })
    }
  }, [user, isLoggedIn])

  // TODO : getCount() utile ? Enregistrer count initial dans un state et MAJ events que s'il change ?
  //    => Les MAJ risquent de ne pas fonctionner comme on garde le même count ?
  const getCount = async () => {
    const count = await countIDBData('userEvents')
    return count
  }
  const getEv = async () => {
    const events = await getAllIDBStoreData('userEvents')
    return events
  }
  // TODO : Pas besoin du async ?
  useEffect(() => {
    if (( !isSelectModalOpen || !isClickModalOpen ) && !isLoggedIn) {
      /*getCount()
        .then(count => {
          if (count > 0) {
            getEv()
              .then(res => {
                setEv(res);
              });
          }
        });*/
      getEv()
        .then(res => {
          setEv(res)
        })
      /*const getEv = async () => {
       const events = await getAllIDBStoreData('userEvents');
       return events;
       };*/
      /*getEv()
       .then(res => {
       setEv(res);
       });*/

    }
  }, [isSelectModalOpen, isClickModalOpen, isLoggedIn]) // TODO : utilisation de isSelectModalOpen pas terrible ?


  // TODO : Revoir l'objet qu'on envoit lors du POST
  async function onInsert(eventInfo) {
    try {
      const eventObject = {
        ...eventInfo,
        ...eventDates,
      }

      if (!isLoggedIn) {
        await addDataToIDBStore('userEvents', eventObject)
        setSelectModalIsOpen(false)
      }
      else {
        // TODO : Comment ne pas insert event si aucun user lié ?
        const res = await axios.post('/events', eventObject)

        if (res.status === 201 || res.status === 200 || res.data.status === 'success') {
          const linkUser = await axios.post(`/events/${res.data.event.id}/linkUser`, {
            userId: user.id,
          })

          if (linkUser.status === 201 || linkUser.data.status === 'success') {
            // TODO : Revoir si utiliser autre syntaxe (plus longue...) ?
            // Display new event
            setEv(prevState => [...prevState, res.data.event])
            setSelectModalIsOpen(false)
          }

          enqueueSnackbar(res.data.message)
        }
      }
    }
    catch (err) {
      console.log(err)
      /*enqueueSnackbar(err.response.data.message || 'Une erreur est survenue');*/
    }
  }

  async function onSingleUpdate(eventInfo) {
    try {
      const { name, value } = eventInfo

      if (!isLoggedIn) {
        updateIDBData('userEvents', Number(selectEventInfo.id), name, value)
        if (isMobile && touch) {
          setTouch(!touch)
        }
        if (isClickModalOpen) {
          setClickModalIsOpen(!isClickModalOpen)
        }
      }
      else {
        const res = await axios.put(`/events/${selectEventInfo.id}`, {
          [name]: value,
        })

        if (res.status === 200 || res.data.status === 'success') {
          enqueueSnackbar(res.data.message)
          // Find the index of the event we want
          /*const index = ev.findIndex(event => event.id == selectEventInfo.id);
           // If no index, event doesn't exist so return
           if (index === -1) return;

           const event = ev[index];
           // Never modify state directly
           const updatedEvent = {
           ...event,
           [eventInfo.name]: eventInfo.value,
           }
           // Never modify state directly : create new array
           const updatedArray = [...ev];
           // Insert updated event at the appropriate index
           updatedArray[index] = updatedEvent;

           setEv(updatedArray);
           console.log('res.data update', res.data);*/

          const updatedState = ev.map(event => {
            if (event.id === Number(selectEventInfo.id)) {
              return {
                ...event,
                [eventInfo.name]: eventInfo.value,
              }
            }
            else {
              return event
            }
          })

          setEv(updatedState)
        }
      }
    }
    catch (err) {
      enqueueSnackbar(err.response.data.message || 'Une erreur est survenue')
    }
  }

  async function onDelete() {
    try {
      if (!isLoggedIn) {
        removeObjectFromStore('userEvents', Number(selectEventInfo.id))
        setClickModalIsOpen(false)
      }
      else {
        const res = await axios.delete(`/events/${selectEventInfo.id}`)

        if (res.status === 200 || res.data.status === 'success') {
          const updatedState = ev.filter(ev => Number(ev.id) !== Number(selectEventInfo.id))

          setEv(updatedState)
          setClickModalIsOpen(false)
          enqueueSnackbar(res.data.message)
        }
      }
    }
    catch (err) {
      enqueueSnackbar(err.response.data.message || 'Une erreur est survenue')
    }
  }


  const handleSelect = (selectInfo) => {
    const calendarApi = selectInfo.view.calendar

    if (!user) {
      calendarApi.unselect()
      return false
    }

    if (moment(selectInfo.start).isBefore(moment())) {
      enqueueSnackbar('Vous ne pouvez pas prendre de RDV dans le passé')
      calendarApi.unselect()
      return false
    }

    setSelectModalIsOpen(true)

    const eventInfo = {
      start: selectInfo.startStr,
      end: selectInfo.endStr,
    }

    setEventDates(eventInfo)
  }

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event

    const { id, title, startStr, endStr } = event
    const { description } = event.extendedProps

    //const start = moment(startStr).format('YYYY-MM-DD HH:mm:ss');
    //const end = moment(endStr).format('YYYY-MM-DD HH:mm:ss');

    const start =
      isLoggedIn ?
        moment(startStr).subtract(1, 'h').format('YYYY-MM-DD HH:mm:ss') :
        moment(startStr).format('YYYY-MM-DD HH:mm:ss')
    const end =
      isLoggedIn ? moment(endStr).subtract(1, 'h').format('YYYY-MM-DD HH:mm:ss') : moment(endStr).format('YYYY-MM-DD HH:mm:ss')

    setSelectedEventInfo({
      id, title, start, end, description,
    })

    setClickModalIsOpen(true)
    // TODO : GET /events/:eventId pour fetch les infos de l'event
  }

  // TODO : Drag & Drop ne fonctionne plus
  const handleEventDrop = async (eventDropInfo) => {
    const event = eventDropInfo.event

    const newStart = moment(event.start).format('YYYY-MM-DD HH:mm:ss')
    const newEnd = moment(event.end).format('YYYY-MM-DD HH:mm:ss')

    if (newStart < moment().format('YYYY-MM-DD HH')) {
      enqueueSnackbar('Vous ne pouvez pas déplacer un évènement dans le passé')
      eventDropInfo.revert()
      return
    }

    try {
      if (!isLoggedIn) {
        updateIDBData('userEvents', Number(event.id), 'start', event.startStr)
        updateIDBData('userEvents', Number(event.id), 'end', event.endStr)

        const updatedEventState = updateEventState(event, {
          start: event.startStr,
          end: event.endStr,
        })
        setEv(updatedEventState)
      }
      else {
        const res = await axios.put(`/events/${event.id}`, {
          start_at: event.startStr,
          end_at: event.endStr,
        })

        if (res.status === 200 || res.data.status === 'success') {
          const updatedEventState = updateEventState(event, {
            start: event.startStr,
            end: event.endStr,
          })
          setEv(updatedEventState)

          // TODO : Update travelEvent lié si il y en a un
          enqueueSnackbar(res.data.message)
        }
      }
    }
    catch (err) {
      console.log(err)
      enqueueSnackbar(err.response.data.message || 'Une erreur est survenue')
    }
  }

  const handleEventResize = async (eventResizeInfo) => {
    const event = eventResizeInfo.event
    const newStart = moment(event.start).format('YYYY-MM-DD HH:mm:ss')
    const newEnd = moment(event.end).format('YYYY-MM-DD HH:mm:ss')

    if (newEnd < moment().format('YYYY-MM-DD HH')) {
      enqueueSnackbar('Vous ne pouvez pas modifier la durée d\'un évènement dans le passé')
      eventResizeInfo.revert()
      return
    }

    const duration = moment.duration(moment(newEnd).diff(moment(newStart)))
    const minutes = duration.asMinutes()

    if (minutes < 60) {
      enqueueSnackbar('La durée minimum d\'un évènement est d\'une heure')
      eventResizeInfo.revert()
      return false
    }
    if (minutes > 240) {
      enqueueSnackbar('La durée maximale d\'un évènement est de 4 heures')
      return eventResizeInfo.revert()
    }

    try {
      if (!isLoggedIn) {
        updateIDBData('userEvents', Number(event.id), 'start', event.startStr)
        updateIDBData('userEvents', Number(event.id), 'end', event.endStr)

        const updatedEventState = updateEventState(event, {
          start: event.startStr,
          end: event.endStr,
        })
        setEv(updatedEventState)
      }
      else {
        const res = await axios.put(`/events/${event.id}`, {
          start_at: event.startStr,
          end_at: event.endStr,
        })

        if (res.status === 200 || res.data.status === 'success') {
          const updatedEventState = updateEventState(event, {
            start: event.startStr,
            end: event.endStr,
          })
          setEv(updatedEventState)
          enqueueSnackbar(res.data.message)
        }
      }
    }
    catch (err) {
      enqueueSnackbar(err.response.data.message || 'Une erreur est survenue')
    }
  }

  const { isMobile } = useDetectDevice()
  const [touch, setTouch] = useState(false)


  const clickModalTitle = windowSize.width > 400 ?
    `RDV du ${moment(selectEventInfo.start).format('DD MMMM YYYY')} de ${moment(selectEventInfo.start).format('HH:mm')} à ${moment(selectEventInfo.end).format('HH:mm')}` :
    `RDV du ${moment(selectEventInfo.start).format('DD MMMM YYYY')}`


  return (
    <>
      <Container>
        <h1 style={{ marginBottom: '2rem' }}>Calendrié personnalisé / partagé PERN Stack :</h1>
        <Modal
          handleClose={() => setSelectModalIsOpen(false)}
          isOpen={isSelectModalOpen}
          title="Ajouter un RDV"
        >
          <SelectModal onInsert={onInsert}/>
        </Modal>
        <Modal
          handleClose={() => {
            setClickModalIsOpen(false)
            //if (isMobile) setTouch(false);
          }}
          isOpen={isClickModalOpen}
          //onTouch={toggleStatus}
          //title={`RDV du ${ moment(selectEventInfo.start).format('DD MMMM YYYY') } de ${
          // moment(selectEventInfo.start).format('HH:mm') } à ${moment(selectEventInfo.end).format('HH:mm')}`}
          title={clickModalTitle}
        >
          <ClickModal
            // TODO : Comment passer title de l'event ici ? Fetch dans ClickModal ou ici et passer en props (en
            // utilisant un state 'eventInfo') ?
            title={selectEventInfo.title}
            start={selectEventInfo.start}
            end={selectEventInfo.end}
            eventObject={selectEventInfo}
            setSelectedEventInfo={setSelectedEventInfo}
            onUpdate={onSingleUpdate}
            onDelete={onDelete}
            touch={touch}
            setTouch={setTouch}
          />
        </Modal>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          navLinks={true}
          nowIndicator={true}
          locale={frLocal}
          timeZone="Europe/Paris"
          dayMaxEvents={true} // Number of events show on dayGrid before "+ X more events"
          slotEventOverlap={false}
          eventOverlap={false}
          selectOverlap={false}
          slotMinTime={'07:00:00'}
          slotMaxTime={'20:00:00'}
          initialView="timeGridWeek"
          defaultTimedEventDuration="01:00" // Min event duration
          editable={true}
          selectable={true}
          selectMirror={false} // true makes placeholders where user selects (false makes highlight)
          //dayMaxEvents={true}
          select={handleSelect}
          //----- TOUCH SUPPORT
          longPressDelay={350}

          moreLinkContent={(args) => {
            //return windowSize.width <= 400 ? '+' + args.num : '+' + args.num + ' RDV';
            return '+' + args.num// + ' RDV'
          }}


          // FIXME : Events
          eventSources={[
            {
              events: ev,
              color: 'blue',
              constraint: 'businessHours',
              //overlap: true,
            },
            {
              events: [],
              color: 'black',
            }]
          }
          //eventAllow={ eventAllow }
          businessHours={[
            {
              daysOfWeek: [0, 1, 2, 3, 4, 5, 6, 7], // Every day
              startTime: '08:00:00',
              endTime: '12:00:00',
            },
            {
              daysOfWeek: [0, 1, 2, 3, 4, 5, 6, 7], // Every day
              startTime: '13:00:00',
              endTime: '20:00:00',
            },
          ]}
          selectConstraint={'businessHours'}
          eventClick={handleEventClick} // TODO : Click sur event => dialog ? Suppr ?
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
        />
      </Container>

      <CalendarDoc/>
    </>
  )
}


/*
 const handleEvents = (events) => {

 }
 const eventAllow = (dropInfo, draggedEvent) => {

 }*/
// TODO : Appel à l'API dans ces Fn ?
/* you can update a remote database when these fire:
 eventAdd={function(){}}
 eventChange={function(){}}
 eventRemove={function(){}}
 */

//eventsSet={ handleEvents }
//eventAdd={function(){ console.warn('eventAdd fired (calendar.js)') }}
//eventAdd={ eventAdd }
// TODO : Test utilisation de ref pour avoir calendarApi et pouvoir refetch quand eventAdd
//ref={calendarRef}