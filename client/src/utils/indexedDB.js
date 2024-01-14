let db;

function indexedDBSupport() {
  return 'indexedDB' in window;
}


// Ne fonctionne pas si on utilise la fonction plusieurs fois
export const createIndexedDB = (dbName, version, storeName, keyPath, autoIncrement = false, indexes = [{}]) => {
  if (!indexedDBSupport()) throw new Error('Votre navigateur ne prend pas en charge IndexedBD');

  const request = indexedDB.open(dbName, version);

  request.onerror = (e) => {
    console.error(`IndexedDB error: ${request.errorCode}`);
  }

  request.onsuccess = (e) => {
    console.info('IndexedDB connectée avec succès');
    db = request.result;
  }

  request.onupgradeneeded = (e/*, dbName, keyPath, indexes = [{}]*/) => {
    console.info('IndexedDB créée');
    db = request.result;

    const objectStore = db.createObjectStore(storeName, { keyPath: keyPath, autoIncrement: autoIncrement });

    // Indexes
    for (let i in indexes) {
      objectStore.createIndex(indexes[i].key, indexes[i].key, { unique: indexes[i].unique });
    }

    objectStore.transaction.oncomplete = (e) => {
      console.log(`Le store ${storeName} a été créé avec succès`);
    }
  }
}

// EXAMPLE : Créer une IDB calendar avec pour store userEvents et les indexes ID (unique), title, start et end (non uniques)
//createIndexedDB('calendar', 1, 'userEvents', 'id', [
//  { key: 'id', unique: true },
//  { key: 'title', unique: false },
//  { key: 'start', unique: false },
//  { key: 'end', unique: false },
//]);

//  Ex :
//    dbName, version, stores = [
//      { storeName, keyPath, autoIncrement, indexes },
//      { storeName, keyPath, autoIncrement, indexes }
//    ]
export const createIndexedDBMultipleStores = (dbName, version, stores = [{}]) => {
  if (!indexedDBSupport()) throw new Error('Votre navigateur ne prend pas en charge IndexedBD');

  const request = indexedDB.open(dbName, version);

  request.onerror = (e) => {
    console.error(`IndexedDB error: ${request.errorCode}`);
  }

  request.onsuccess = (e) => {
    console.info('IndexedDB connectée avec succès');
    db = request.result;
  }

  request.onupgradeneeded = (e/*, dbName, keyPath, indexes = [{}]*/) => {
    console.info('IndexedDB créée');
    db = request.result;

    stores.forEach((store, i, array) => {
      //console.log('arr i', array[i]);
      const objectStore = db.createObjectStore(store.storeName, { keyPath: store.keyPath, autoIncrement: store.autoIncrement });

      for (let i in store.indexes) {
        objectStore.createIndex(store.indexes[i].key, store.indexes[i].key, { unique: store.indexes[i].unique });
      }

      objectStore.transaction.oncomplete = (e) => {
        console.log(`Le store ${store.storeName} a été créé avec succès`);
      }
    });

    /*const objectStore = db.createObjectStore(storeName, { keyPath: keyPath, autoIncrement: autoIncrement });

    // Indexes
    for (let i in indexes) {
      objectStore.createIndex(indexes[i].key, indexes[i].key, { unique: indexes[i].unique });
    }

    objectStore.transaction.oncomplete = (e) => {
      console.log(`Le store ${storeName} a été créé avec succès`);
    }*/
  }
}



export const addEvent = (storeName, eventObject) => {
  const transaction = db.transaction(storeName, 'readwrite');

  transaction.oncomplete = function(e) {

  }

  transaction.onerror = function(e) {

  }

  const objectStore = transaction.objectStore(storeName);

  // Add new event
  const request = objectStore.add(eventObject);

  request.onsuccess = () => {
    // request.result contains key of the added object
    console.log(`Nouvel event créé : ${request.result}`);
  };

  request.onerror = (err)=> {
    console.error(`Erreur lors de l'ajout de l'event : ${err}`)
  };
}

// Example : Insérer un event dans le store userEvents
//const currentTime = new Date().getTime();
//const startTime = new Date(currentTime + 10 * 60 * 60 * 1000);
//const endTime = new Date(currentTime + 14 * 60 * 60 * 1000);
//
//const eventObject = {
//  title: 'Event Object IDB',
//  start: startTime,
//  end: endTime,
//  description: 'Description event object IDB',
//};
//
//addEvent('userEvents', eventObject);


export const addDataToIDBStore = (storeName, data) => {
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, 'readwrite')
      .objectStore(storeName)
      .put(data);

    request.onsuccess = () => {
      // request.result contains key of the added object
      console.log(`Nouvelles données créées : ${request.result}`);
      resolve(request.result);
    };

    request.onerror = (err) => {
      reject(err);
      console.error(`Erreur lors de l'ajout des données : ${err}`);
    };
  });
};

// Example : Insérer un event dans le store userEvents
//const currentTime = new Date().getTime();
//const startTime = new Date(currentTime + 10 * 60 * 60 * 1000);
//const endTime = new Date(currentTime + 14 * 60 * 60 * 1000);
//
//const eventObject = {
//  title: 'Event Object IDB',
//  start: startTime,
//  end: endTime,
//  description: 'Description event object IDB',
//};
//
//addEvent('userEvents', eventObject);


export const addMultipleDataToIDBStore = (storeName, multipleData) => {
  const transaction = db.transaction(storeName, 'readwrite');

  transaction.oncomplete = function(event) {
    console.log('Données ajoutés à IDB avec succès');
  };

  transaction.onerror = function(err) {
    console.error(`Erreur lors de l'ajout des données : ${err}`);
  };

  const objectStore = transaction.objectStore(storeName);

  for (let eventObject of multipleData) {
    const request = objectStore.add(multipleData);

    request.onsuccess = () => {
      // request.result contains key of the added object
      console.log(`Nouvel event créé : ${request.result}`);
    };

    request.onerror = (err) => {
      console.error(`Erreur lors de l'ajout de l'event : ${err}`)
    };
  }
};

// EXAMPLE : Insérer plusieurs events dans le store userEvents
//const currentTime = new Date().getTime();
//const startTimeEvent1 = new Date(currentTime + 10 * 60 * 60 * 1000);
//const endTimeEvent1 = new Date(currentTime + 14 * 60 * 60 * 1000);
//const startTimeEvent2 = new Date(currentTime + 14 * 60 * 60 * 1000);
//const endTimeEvent2 = new Date(currentTime + 16 * 60 * 60 * 1000);
//const startTimeEvent3 = new Date(currentTime + 16 * 60 * 60 * 1000);
//const endTimeEvent3 = new Date(currentTime + 20 * 60 * 60 * 1000);
//
//const events = [
//  { id: 1, title: 'Event IDB 1', start: startTimeEvent1, end: endTimeEvent1 },
//  { id: 2, title: 'Event IDB 2', start: startTimeEvent2, end: endTimeEvent2 },
//  { id: 3, title: 'Event IDB 3', start: startTimeEvent3, end: endTimeEvent3 },
//];
//
//addEvents('userEvents', events);

export const removeObjectFromStore = (storeName, key) => {
  const request = db.transaction(storeName, 'readwrite')
    .objectStore(storeName)
    .delete(key);

  request.onsuccess = () => {
    console.log(`Object deleted : ${request.result}`);
  };

  request.onerror = (err) => {
    console.error(`Error to delete object : ${err}`);
  };
}

// EXAMPLE : Retirer l'event dont l'ID est 3 du store userEvents
//removeObjectFromStore('userEvents', 3);

export default function emptyStore(storeName) {
  const request = db.transaction(storeName, 'readwrite')
    .objectStore(storeName)
    .clear();

  request.onsuccess = () => {
    console.log(`Object Store "${storeName}" emptied`);
  };

  request.onerror = (err) => {
    console.error(`Error to empty Object Store: ${storeName}`)
  };
}

// EXAMPLE : Vider l'IDB userEvents
//emptyStore('userEvents');

// Returns undefined if the stored object has an undefined value or the object doesn't exist
export function getIDBSingleData(storeName, key) {
  const request = db.transaction(storeName)
    .objectStore(storeName)
    .get(key);

  request.onsuccess = () => {
    const result = request.result;

    return result;
  };

  request.onerror = (err) => {
    console.error(`Erreur pour récupérer l'objet depuis ${storeName} : ${err}`);
  };
}

// EXAMPLE : Récupérer les données d'un utilisateur du store users
//getIDBSingleData('users', 'tom.pomarede687@gmail.com');

// TODO : Pas besoin du async ?
export async function getAllIDBStoreData(storeName) {
  return new Promise(resolve => {
    const request = db.transaction([storeName])
      .objectStore(storeName)
      .getAll();

    //const req = await new Promise(resolve => {
      request.onsuccess = () => {
        const results = request.result;
        console.log(`Tous les résultats du store ${storeName} récupérés`, results);

        resolve(results);
      };

    request.onerror = (err) => {
      console.error(`Error getting all data from ${storeName} : ${err}`);
    };
  });
}

// EXAMPLE : Récupérer tous les events du store userEvents
//getAllIDBStoreData('userEvents');


// On utilise openCursor() pour pouvoir travailler sur chaque objet d'un store tel qu'il est
// Ou encore pour travailler avec les clés de chaque objet stocké dans le store, puisque le curseur est + efficient…
// … que getAll() dans ce cas spécifique
export function printData(storeName) {
  const request = db.transaction(storeName)
    .objectStore(storeName)
    .openCursor();

  request.onsuccess = () => {
    const cursor = request.result;

    if (cursor) {
      // printInfo est ici une fonction tierce, qui affiche toutes les propriétés des object stockés
      //printInfo(cursor.value);
      cursor.continue();
    }
    else {
      console.log('Plus d\'entrées à examiner');
    }
  }
}

// EXAMPLE : Récupérer les propriétés et / ou travailler sur chaque objet du store userEvents tels qu'ils sont donnés
//printData('userEvnts');


// Update une donnée dans l'IDB avec put(item, key)
// put(item, key) va MAJ la donnée si elle existe et la créer si elle n'existe pas
// Le param key est optionnel et fait référence à la clé de l'objet
// Le param key est nécessaire seulement si on utilise une valeur auto-incrémentée est utilisée en tant que clé de …
// … l'objet stocké

// Pour MAJ, on utilise généralement get(key) pour récupérer l'objet stocké, puis on MAJ les propriétés voulues
// Enfin, put(obj) est utilisé avec le nouvel objet

export function updateIDBData(storeName, key, propertyToUpdate, newPropertyValue) {
  const objectStore = db.transaction(storeName, 'readwrite')
    .objectStore(storeName);

  const request = objectStore.get(key);

  request.onsuccess = () => {
    const result = request.result;

    // Change the name property
    result[propertyToUpdate] = newPropertyValue;

    // Create a request to update
    const updateRequest = objectStore.put(result);

    updateRequest.onsuccess = () => {
      console.log(`Donnée du store ${storeName} dont la clé est ${key} a été MAJ : ${updateRequest.result}`);
    };
  };
}

// EXAMPLE : MAJ le nom de l'utilisateur Tom à Guio du store users en utilisant l'email de Tom en tant que key
//updateIDBData('tom.pomarede687@gmail.com');


export async function countIDBData(storeName) {
  return new Promise(resolve => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);

    const countRequest = objectStore.count();

    countRequest.onsuccess = () => {
      resolve(countRequest.result);
    }
  })

}