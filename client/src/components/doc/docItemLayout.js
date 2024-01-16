import React, { lazy, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Prism from 'prismjs'
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.min'
import 'prismjs/plugins/toolbar/prism-toolbar.min.css'
import 'prismjs/plugins/toolbar/prism-toolbar.min'
import 'prismjs/plugins/show-language/prism-show-language.min'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.min.css'
import { CardItem, CardWrapper, DescriptionParagraph } from '../styles/docStyles'
import { Link, useLocation } from 'react-router-dom'

export default function DocItemLayout({
  title,
  description,
  endpoint,         // { url, method }
  urlParams,        // { required, params }
  dataParams,        // code
  successResponse,  // { code, data }
  errorResponse,    // { code, data }
  sampleRequest,    // code
  code,
  errorCode,
  id,
}) {

  useEffect(() => {
    Prism.plugins.NormalizeWhitespace.setDefaults({
      'remove-trailing': true,
      'remove-indent': true,
      'left-trim': true,
      'right-trim': true,
      'break-lines': 80, //max number of characters in each line before break
      'tabs-to-spaces': 2,
      //'spaces-to-tabs': 88,
      //'indent': 0
    })

    Prism.highlightAll()
  }, [])

  let location = useLocation()

  useEffect(() => {
    const anchor = location.hash.slice(1)

    if (anchor) {
      const anchorEl = document.getElementById(anchor)
      if (anchorEl) {
        anchorEl.scrollIntoView({
          //behavior: 'smooth'
        })
      }
    }
  }, [location])

  const descriptionRef = useRef(null)

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.innerHTML = description
    }
  }, [description, descriptionRef])

  return (
    <div id={id} /*className="line-numbers"*/>
      <CardWrapper>
        <TitleWrapper>
          <h3>{title}</h3>
          <UpLink to={{ pathname: location.pathname, hash: '#top' }}>&#8593;</UpLink>
        </TitleWrapper>

        {
          description &&
          <DescriptionParagraph ref={descriptionRef}>
            {description}
          </DescriptionParagraph>
        }

        <CardItem>
          <ul>
            <li><h4>URL :</h4></li>
            <li>{endpoint.url}</li>
            <li><h4>Method :</h4></li>
            <li><code>{endpoint.method}</code></li>
          </ul>
        </CardItem>


        {/* TODO : Modifier pour pouvoir avoir plusieurs params (et qu'ils soient soit "required" soit "optional") */}
        <CardItem>
          <h4>URL Params :</h4>
          <ul>
            {
              urlParams && urlParams.required ? (
                <li><strong>Required :</strong></li>
              ) : null
            }
            {
              urlParams && urlParams.params ? (
                <li><code>{urlParams.params}</code></li>
              ) : (
                <li>Aucun</li>
              )
            }
          </ul>
        </CardItem>

        <CardItem>
          <h4>Data params :</h4>
          {
            dataParams ? (
              <pre data-title="data">
								<code className={`language-javascript`}>
									{dataParams}
								</code>
							</pre>
            ) : (
              <ul>
                <li>Aucun</li>
              </ul>
            )
          }
        </CardItem>

        <CardItem>
          <h4>Success Reponse :</h4>

          <ul>
            <li>Code : <code>{code}</code></li>
            <li>Content :
              <pre>
								<code className={`language-javascript`}>
									{successResponse}
								</code>
							</pre>
            </li>
          </ul>
        </CardItem>

        <CardItem>
          <h4>Error Response :</h4>
          {
            errorResponse ? (
              <ul>
                {
                  typeof errorCode === 'object' && errorCode.map((code, i) => {
                    if (errorCode.length > 1) {
                      return (
                        <React.Fragment key={i}>
                          <li key={i}>Code: <code>{code}</code></li>
                          <li key={i + 1}>OU</li>
                        </React.Fragment>
                      )
                    }

                    return (
                      <li key={i}>Code: <code>{code}</code></li>
                    )
                  })
                }
                <li>Code : <code>{errorCode}</code></li>
                <li>Content :
                  <pre className={`language-javascript`}>
									<code>
										{errorResponse}
									</code>
								</pre>
                </li>
              </ul>
            ) : (
              <ul>
                <li>Aucune</li>
              </ul>
            )
          }
        </CardItem>

        {/*{
					errorResponse &&
					<CardItem>
						<h4>Error Response :</h4>
						<ul>
							{
								typeof errorCode === 'object' && errorCode.map((code, i) => {
									if (errorCode.length > 1) {
										return (
											<React.Fragment key={i}>
												<li key={i}>Code: <code>{ code }</code></li>
												<li key={i+1}>OU</li>
											</React.Fragment>
										)
									}
									
									return (
										<li key={i}>Code: <code>{ code }</code></li>
									)
								})
							}
							<li>Code : <code>{ errorCode }</code></li>
							<li>Content :
									<pre className={`language-javascript`}>
										<code>
											{ errorResponse }
										</code>
									</pre>
							</li>
						</ul>
					</CardItem>
				}*/}

        <CardItem>
          <h4>Sample request (async/await) :</h4>

          <pre data-title="data">
						<code className={`language-javascript`}>
							{sampleRequest}
						</code>
					</pre>
        </CardItem>

      </CardWrapper>
    </div>
  )
}

const TitleWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: baseline;
`

const UpLink = styled(Link)`
    text-decoration: none;
    margin-left: 1.5rem;
    font-size: 2rem;
    position: relative;
    top: 4px;
`