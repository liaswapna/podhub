import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUser, faHome, faBell, faCircle } from '@fortawesome/free-solid-svg-icons'
import Logo from "./purple_back.png";
import NavbarAudio from "../NavbarAudio/navbarAudio";
import Popup from "reactjs-popup";
import OptionsMenu from "../OptionsMenu/optionsMenu";
import "./navbar.css";
import moment from "moment";
import API from "../../utils/API";

library.add(faSearch, faUser, faHome, faBell, faCircle);

// NAVBAR COMPONENT
// Rendered by App.js on every page
// Contains Logo, links to Home, Profile, User Search, Podcast Search form, and logout button
// Can also display audio player

class Navbar extends Component {

  state = {
    remove: false,
    speed: 1.0,
    showOptionsMenu: false,
    goToPodcastPage: false,
    //isAlert: true
  };

  // componentWillReceiveProps(nextProps) {
  //   // You don't have to do this check first, but it can help prevent an unneeded render
  //   if (nextProps.notificationAlert !== this.state.isAlert) {
  //     this.setState({ isAlert: this.props.notificationAlert });
  //   }
  // }

  // NAVBAR AUDIO PLAYER
  // ====================================

  // Change speed of audio playback
  changeSpeed = (event) => {
    this.setState({
      speed: event.target.value
    });
  }

  itIsMountedNav = (bool) => {
    this.props.itIsMountedApp(bool);
  }

  isPlaying = (opposite) => {
    this.props.isPlayingApp(opposite);
  }


  // OPTIONS MENU
  // ====================================

  showOptionsMenu = () => {
    this.setState({
      showOptionsMenu: true
    });
  }

  hideOptionsMenu = () => {
    this.setState({
      showOptionsMenu: false
    });
  }


  // OTHER
  // ====================================

  // This will redirect user to Podcast Search page 
  // if user clicks Enter with input in search box
  handleEnter = (event) => {
    if (window.event.keyCode === 13) {
      event.preventDefault();

      this.setState({
        goToPodcastPage: true
      });
    }
  }

  resetState = () => {
    this.setState({
      goToPodcastPage: false
    });
  }

  scrollToTop = () => {
    window.scrollTo(0, 0);
  }

  // hide notification alert and save a record of the date and time when user has checked his notifications last time 
  // lastCheckedNotification = () => {
  //   this.setState({
  //     isAlert: false
  //   });


  //   API.lastCheckedNotification(this.props.user.id, moment().format())
  //     .then(res => { })
  // }


  render() {

    const { podcastSearch, handleInputChange, hidePodcasts, logout, user, showAudio, hideAudio, theme, notificationAlert, setNotificationAlertOff } = this.props;

    return (

      <nav className={`navbar navbar-expand-lg navbar-${theme} bg-${theme} sticky-top`}>
        <div className="container fluid" id="navContentContainer">

          {/* Podhub Logo */}

          <div className="navbar-header">
            <Link className="navbarText navbar-brand" to={{
              pathname: "/home",
            }} onClick={this.scrollToTop}>
              <img src={Logo} alt="logo" id="size" />
            </Link>
          </div>
          <div className="fulllength">
            {showAudio ? (
              <div className="mobilePosition">
                <Popup
                  trigger={
                    <span>
                      <NavbarAudio
                        audioLink={this.props.audioLink}
                        playbackRate={this.state.speed}
                        changeSpeed={this.changeSpeed}
                        initialSpeed={this.state.speed}
                        remove={this.state.remove}
                        aCurrentTime={this.props.rawCurrentTime}
                        itIsMounted={this.itIsMountedNav}
                        isPlaying={this.isPlaying}
                        isItPlaying={this.props.isItPlaying}
                        isMounted={this.props.isMounted}
                        theme={this.props.theme}
                      />
                    </span>
                  }
                  on="hover"
                  position="bottom center"
                  className="navbarAudioPopup"
                  closeDocumentOnClick
                >
                  <p className="navbarPopupText" id="topPopupText">
                    {this.props.podcastName}
                  </p>

                  <p className="navbarPopupText">
                    {this.props.episodeName}
                  </p>

                  <button className="btn btn-dark btn-sm hideAudioBtn" onClick={hideAudio}>
                    Hide Audio Player
                    </button>
                </Popup>
              </div>
            ) : (
                <></>
              )
            }
          </div>

          {/* Hamburger Menu */}

          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Menu */}

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <ul className="navbar-nav">

              {/* Home */}

              <li className="nav-item">
                <Link
                  to={{
                    pathname: "/home",
                  }}
                  className={
                    window.location.pathname === "/home"
                      ? `nav-link ${this.props.theme} active`
                      : `nav-link ${this.props.theme}`
                  }
                  onClick={this.scrollToTop}
                >
                  <FontAwesomeIcon icon="home" />
                  &nbsp; Home
                </Link>
              </li>

              {/* Profile */}

              <li className="nav-item">
                <Link
                  to={{
                    pathname: "/profile",
                    state: {
                      user: user
                    }
                  }}
                  className={
                    window.location.pathname === "/profile"
                      ? `nav-link ${this.props.theme} active`
                      : `nav-link ${this.props.theme}`
                  }
                  onClick={this.scrollToTop}
                >
                  <FontAwesomeIcon icon="user" />
                  &nbsp; Profile
                </Link>
              </li>

              {/* Find Users */}

              <li className="nav-item">
                <Link
                  to={{
                    pathname: "/userSearch",
                  }}
                  className={
                    window.location.pathname === "/userSearch"
                      ? `nav-link ${this.props.theme} active`
                      : `nav-link ${this.props.theme}`
                  }
                >
                  <FontAwesomeIcon icon="search" />
                  <span className={`navbar-theme-{this.props.theme}`}>&nbsp; Find Users</span>
                </Link>
              </li>

              <li className="nav-item notifications">
                <Link
                  to={{
                    pathname: "/notifications",
                  }}
                  className={
                    window.location.pathname === "/notifications"
                      ? `nav-link ${this.props.theme} active`
                      : `nav-link ${this.props.theme}`
                  }
                  onClick={setNotificationAlertOff}
                >
                  <FontAwesomeIcon icon="bell" />
                  <span className={`navbar-theme-{this.props.theme}`}>&nbsp; Notifications </span>
                  {notificationAlert 
                    ? <FontAwesomeIcon icon="circle" size="xs" className="mb-1" />
                    : null
                  }
                </Link>

              </li>
            </ul>

            {/* Show Audio Player in Nav Bar */}



            {/* Podcast Search form */}

            <ul className="navbar-nav ml-auto">
              <li>
                <form className="form-inline my-2 my-lg-0 searchPodcastForm">
                  <input className="form-control mr-sm-2 searchPodcastInput"
                    type="search"
                    placeholder="Search Podcasts"
                    aria-label="Search"
                    id="podcastInput"
                    value={podcastSearch}
                    name="podcastSearch"
                    autoComplete="off"
                    onBlur={hidePodcasts}
                    onKeyPress={this.handleEnter}
                    onChange={handleInputChange}
                    onFocus={handleInputChange}
                    required
                  />
                </form>
              </li>

              {/* REDIRECT TO PODCAST SEARCH PAGE */}

              {this.state.goToPodcastPage ? (
                <Redirect
                  to={{
                    pathname: "/podcastSearch",
                    resetState: this.resetState
                  }}
                />
              ) : (
                  <></>
                )}

              {/* Settings/Logout Dropdown Menu */}

              <li>

                <div
                  onClick={this.showOptionsMenu}
                  className="holder"
                >
                  {this.state.showOptionsMenu ? (
                    <OptionsMenu
                      user={this.props.user}
                      hideOptionsMenu={this.hideOptionsMenu}
                      logout={logout}
                    />
                  ) : (
                      <></>
                    )}
                  <img
                    className="navbarUserImg"
                    src={this.props.user.profileImage} />
                </div>


              </li>

            </ul>
          </div>
        </div>
      </nav>
    )
  }
};

export default Navbar;
