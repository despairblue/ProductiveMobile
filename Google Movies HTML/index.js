import React from 'react'
import ReactDOM from 'react-dom'

// Using a media query like `window.matchMedia('only screen and (max-width:
// 760px)')` would probably be better, but the originial static site is missing
// a viewport meta-tag that prevents scaling, thus the site will be scaled in
// most mobile browser and the media query will always not match
//
// This works on iOS with Chrome and Safari and on Android with Chrome and Firefox
if (window.screen.width < 760) {
  const AccountBar = ({domNode}) => {
    const name = domNode.querySelector('div.gb_ae.gb_R.gb_oe.gb_he')
    const jewels = domNode.querySelector('div.gb_Ob.gb_oe.gb_R')

    return (
      <div
        style={{
          // it seems that vendor prefixing `display: flex` in react for inline
          // styles is not possible since I can't simply define the same key on
          // an object twice, but this works on initial render since React uses
          // innerHTML
          //
          // @see https://github.com/facebook/react/issues/2020#issuecomment-123402094
          display: '-webkit-flex; display:flex',
          WebkitJustifyContent: 'space-between',
          justifyContent: 'space-between',
          WebkitAlignItems: 'center',
          alignItems: 'center',
          // this is to offset the negative margin on the profile picture,
          // otherwise the picture and the search buttons wouldn't be aligned
          margin: 1
        }}>
        <div dangerouslySetInnerHTML={{__html: name.outerHTML}}/>
        <div dangerouslySetInnerHTML={{__html: jewels.outerHTML}}/>
      </div>
    )
  }

  const SearchBar = ({domNode}) => {
    const searchBarContainer = domNode.querySelector('#gbq2')

    // I could have also used a negative margin, like `marginTop: -10`, for
    // offsetting the inner padding, but redefining it seems a little cleaner
    // since the element has an id and I don't have to select it by some
    // arbitrary classes and relative position
    searchBarContainer.style.padding = '5px 0'

    return <div dangerouslySetInnerHTML={{__html: domNode.innerHTML}}/>
  }

  const LocationSearch = ({oldFilter}) => {
    const oldLocationSearch = oldFilter.querySelector('div.section')

    // This is seriously flawed and could break on any Chrome/Safari update.
    // Yes, I feel bad about it.
    // This could be fixed by defining this in an external stylesheet
    // and simply adding a class here
    if (oldLocationSearch.webkitAppearance) {
      oldLocationSearch.style.display = '-webkit-flex'
      oldLocationSearch.style.webkitJustifyContent = 'space-between'
      oldLocationSearch.style.webkitAlignItems = 'center'
    } else {
      oldLocationSearch.style.display = 'flex'
      oldLocationSearch.style.justifyContent = 'space-between'
      oldLocationSearch.style.alignItems = 'center'
    }

    return <span dangerouslySetInnerHTML={{__html: oldFilter.outerHTML}}/>
  }

  const DropDownFilter = ({oldFilter}) => (
    <select
      value={oldFilter.querySelector('div b').textContent}
      onChange={event => window.location = event.target.value}
      >
      {Array.prototype.map.call(oldFilter.querySelectorAll('div b, div a'), node => {
        if (node.nodeName.toLowerCase() === 'b') {
          return (
            <option
              key={node.textContent.substring(2)}
              value={node.textContent.substring(2)}
              >
                {node.textContent.substring(2)}
              </option>
            )
        } else {
          return (
            // I'm (mis)using the value prop here to save the href the orginal filter was pointing to
            <option
              key={node.textContent}
              value={node.href}
              data-href={node.href}
              >
                {node.textContent}
              </option>
          )
        }
      })}
    </select>
  )

  const DateFilter = ({oldFilter}) => (
    <DropDownFilter oldFilter={oldFilter}/>
  )

  const TimeFilter = ({oldFilter}) => (
    <DropDownFilter oldFilter={oldFilter}/>
  )

  const VenueFilter = ({oldFilter}) => (
    <DropDownFilter oldFilter={oldFilter}/>
  )

  const ViewFilter = ({oldFilter}) => (
    <DropDownFilter oldFilter={oldFilter}/>
  )

  const Filter = ({domNode}) => (
    <div
      style={{
        display: '-webkit-flex; display: flex',
        WebkitJustifyContent: 'space-between',
        justifyContent: 'space-between',
        padding: '5px 0',
        // Chrome on android makes selects wide enough to display the
        // longest possible option and thus this component might overflow.
        // Google makes the search tools (Web, Images ... Search Tools) scroll sideways
        // on mobile. So I think this is a good solution for not interrrupting the layout.
        overflow: 'scroll'
      }}>
      <DateFilter oldFilter={domNode.querySelector('#left_nav > div:nth-child(2)')}/>
      <TimeFilter oldFilter={domNode.querySelector('#left_nav > div:nth-child(3)')}/>
      <VenueFilter oldFilter={domNode.querySelector('#left_nav > div:nth-child(4)')}/>
      <ViewFilter oldFilter={domNode.querySelector('#left_nav > div:nth-child(5)')}/>
    </div>
  )

  const Movie = ({domNode}) => (
    <div
      style={{
        padding: 5,
        marginTop: '10px',
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)'
      }}
      >
      <div dangerouslySetInnerHTML={{__html: domNode.querySelector('div.name').innerHTML}}/>
      <div dangerouslySetInnerHTML={{__html: domNode.querySelector('span.info').innerHTML}}/>
      <div dangerouslySetInnerHTML={{__html: domNode.querySelector('div.times').innerHTML}}/>
    </div>
  )

  const MovieList = ({domNodes}) => (
    <div>
      {Array.prototype.map.call(domNodes, movie => <Movie domNode={movie}/>)}
    </div>
  )

  const Venue = ({domNode}) => (
    <div
      style={{
        padding: 10,
        margin: '10px 0',
        backgroundColor: '#F8F8F8',
        boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)'
      }}
      >
      <h1 dangerouslySetInnerHTML={{__html: domNode.querySelector('h2.name').innerHTML}}/>
      <div dangerouslySetInnerHTML={{__html: domNode.querySelector('div.info').innerHTML}}/>
      <MovieList domNodes={domNode.querySelectorAll('div.showtimes div.movie')}/>
    </div>
  )

  const VenueList = ({domNode}) => (
    <div>
      {Array.prototype.map.call(domNode.children, venue => <Venue domNode={venue}/>)}
    </div>
  )

  const Root = ({domNode}) => (
    <div style={{margin: 5}}>
      <AccountBar domNode={domNode.querySelector('#gb > div.gb_td.gb_oe > div.gb_La.gb_oe.gb_R.gb_ne.gb_T')} />
      <SearchBar domNode={domNode.querySelector('#gb > div.gb_td.gb_oe > div.gb_R.gb_pd')} />
      <LocationSearch oldFilter={domNode.querySelector('#left_nav > form')}/>
      <Filter domNode={domNode.querySelector('#left_nav')} />
      <VenueList domNode={domNode.querySelector('#movie_results > div')} />
    </div>
  )

  const oldElements = document.querySelectorAll('#gb, #gba, #title_bar, #left_nav, #results, #navbar, #bottom_search, body > center, body > br')

  Array.prototype.map.call(oldElements, node => node.style.display = 'none')

  const container = document.createElement('div')
  document.body.appendChild(container)

  const meta = document.createElement('meta')
  meta.name = 'viewport'
  meta.content = 'width=device-width, initial-scale=1'
  document.head.appendChild(meta)

  document.body.style.margin = '3px'

  ReactDOM.render(<Root domNode={document.body}/>, container)
}
