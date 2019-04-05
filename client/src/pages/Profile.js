import React, { Component } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import Container from "../components/Container/container";
import Row from "../components/Row/row";
import API from "../utils/API";
import Podcast from "../components/Podcast/podcast";
import PostCard from "../components/PostCard/postCard";
import "./Profile.css";
import Delete from "./delete.png";
import moment from "moment";
import Modal from "react-responsive-modal";
import User from "../components/User/user";
import List from "../components/List/list";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// USER PROFILE PAGE

class Profile extends Component {
  state = {
    user: [],
    posts: [],
    followers: 0,
    actualFollowers: [],
    following: 0,
    actualFollowing: [],
    favorites: [],
    showLikesModal: false,
    likes: [],
    redirect: false,
    showCommentsModal: false,
    comments: [],
    currentComment: "",
    currentPostId: "",
    commentLikes: [],
    showFollowers: false,
    showFollowingModal: false
  };

  // Load user profile information
  componentDidMount() {
    this.getFavorites();
    this.getPostsOnlyByUser();
    this.getFollowers();
    this.getFollowing();
    this.setState({
      user: this.props.location.state.user
    });
  }

  // Update profile information if user's change
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.state.user.id !== this.props.location.state.user.id) {

      this.getFavorites();
      this.getPostsOnlyByUser();
      this.getFollowers();
      this.getFollowing();
      this.setState({
        user: this.props.location.state.user
      });
    }
  }

  getPostsOnlyByUser = () => {
    API.getPostsOnlyByUser(this.props.location.state.user.id)
      .then(res => {
        if (res.data.length === 0) {
          this.setState({
            posts: [],
            messageNoPodcast: "No posts found."
          });
        } else {
          this.setState({
            posts: res.data
          });
        }
      })
      .catch(() => {
        this.setState({
          posts: [],
          messageNoPodcast: "No posts found."
        });
      });
  };

  getFavorites = () => {
    API.getFavorites(this.props.location.state.user.id)
      .then(res => {
        if (res.data.length === 0) {
          this.setState({
            favorites: [],
            messageNoFav:
              "No favorites found."
          });
        } else {
          this.setState({
            favorites: res.data
          });
        }
      })
      .catch(() => {
        this.setState({
          favorites: [],
          messageNoFav:
            "No favorites found."
        });
      });
  };

  getOrCreateUser = () => {
    API.getOrCreateUser(this.props.location.state.user.id).then(res => {
      this.setState({
        user: res.data
      });
    });
  };

  getActualFollowers = () => {

    API.isFollowedByUsers(this.state.user.id)
      .then(res => {
        // console.log(res);
        this.setState({
          actualFollowers: res.data,
        }, () => { this.showFollowersModal() });
      });
  }

  getUsersFollowed = () => {

    API.getUsersFollowed(this.state.user.id)
        .then(res => {
            this.setState({
                actualFollowing: res.data
            }, () => {this.showFollowingModal() });
        });
}     

showFollowingModal = () => {
  this.setState({
    showFollowingModal: true
  });
}

  getFollowers = () => {
    API.getFollowers(this.props.location.state.user.id)
      .then(res => {
        this.setState({
          followers: res.data[0].count
        });
      })
      .catch(() => {
        this.setState({
          followers: 0
        });
      });
  };

  getFollowing = () => {
    API.getFollowing(this.props.location.state.user.id)
      .then(res => {
        this.setState({
          following: res.data[0].count
        });
      })
      .catch(() => {
        this.setState({
          following: 0
        });
      });
  };

  handlePostDelete = (id) => {
      API.handlePostDelete(id)
        .then(res => {
          this.getPostsOnlyByUser();
        });
  };

  handleFavoriteDelete = id => {
      API.handleFavoriteDelete(id).then(res => {
        this.getFavorites();
      });
  };

  //Opens the Likes modal
  //Executed upon user clicking "Likes" button on page
  handleShowLikes = postId => {

    API.getLikes(postId).then(res => {
      //console.log(res.data);
      if (res.data.length === 0) {
        this.setState({
          showLikesModal: false
        });
      }
      else {
        this.setState({
          likes: res.data,
          showLikesModal: true
        });
      }
    });
  };

  handleLikeOrUnlike = postId => {
    API.likePost(postId, this.state.user.id).then(res => {
      //console.log(res.data)
      if (res.data[1] === false) {
        API.unlikePost(postId, this.state.user.id).then(res => {
          //console.log(res.data)
          this.getPostsOnlyByUser();
        })
      } else{
        this.getPostsOnlyByUser();
      }
      
    })
  }

  // Closes Likes Episode modal
  // Executed upon user clicking "Likes" button in modal
  closeLikesModal = () => {
    this.setState({
      showLikesModal: false
    });
  };

  listenToEpisode = event => {
    event.preventDefault();

    this.setState({
      redirect: true
    });
  }

  handleCommentLikeOrUnlike = commentId => {
    API.likeComment(commentId, this.state.user.id).then(res => {
      if (res.data[1] === false) {
        API.unlikeComment(commentId, this.state.user.id).then(res => {
          // console.log(res.data)
          this.handleShowComments(this.state.currentPostId);
        })
      }else{
        this.handleShowComments(this.state.currentPostId);
      }
      // this.getPostsOnlyByUser();
      // this.handleShowComments();
    })
  }

  handleShowCommentsLikes = commentId => {
    API.getLikes(commentId).then(res => {
      //console.log(res.data);
      if (res.data.length === 0) {
        this.setState({
          showLikesModal: false
        });
      }
      else {
        this.setState({
          commentLikes: res.data,
          showLikesModal: true
        });
      }
    });
  }

  handleShowComments = postId => {
    this.setState({
      currentPostId: postId
    });
    API.getComments(postId).then(res => {
      // console.log(res.data);
      if (res.data.length === 0) {
        this.setState({
          comments: res.data,
          showCommentsModal: true,
        });
      }
      else {
        this.setState({
          comments: res.data,
          showCommentsModal: true,
          currentPostId: postId
        });
      }
    });
  };

  addComment = () => {
    API.addComment(this.state.currentComment, this.state.currentPostId, this.state.user.id).then(res => {
      // console.log(res.data)
      this.getPostsOnlyByUser();
      this.handleShowComments();
      this.closeCommentsModal();
    })
  }

  deleteComment = (commentId) => {
      API.deleteComment(commentId).then(res => {
        // console.log(res.data)
        this.getPostsOnlyByUser();
        this.handleShowComments();
        this.closeCommentsModal();
      });
  };

  closeCommentsModal = () => {
    this.setState({
      showCommentsModal: false
    });
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  showFollowersModal = () => {
    this.setState({
      showFollowers: true
    });
  }

  hideFollowersModal = () => {
    this.setState({
      showFollowers: false,
      showFollowingModal: false
    });
  }

  scrollTo = () => {
    window.scrollTo(0, 500);
  }

  render() {
    return (
      <div className="container">
      <Row>
        <div class="col-md-2 col-xs-0"></div>
        <div class="col-md-8 col-xs-12">
        <Container>
        
        <div className="row userProfile rounded bg-dark text-white">
          <div className="col-5">
            <img
              src={this.props.location.state.user.profileImage}
              alt="User"
              id="userMainProfileImage"
              className="rounded border-white"
            />
          </div>

          <div className="col">
            <Row>
              <h2 className="paddingTop">{this.props.location.state.user.name}</h2>
            </Row>
            <Row>
              Posts:&nbsp; {this.state.posts.length} &nbsp;&nbsp; <strong>-</strong> &nbsp;&nbsp;
              Followers:&nbsp;{this.state.followers} &nbsp;&nbsp; <strong>-</strong> &nbsp;&nbsp;
              Following:&nbsp;{this.state.following}
            </Row>
          </div>
        </div>

        <div className="row favorites rounded">
          <h4>Favorites: </h4>

          {this.state.favorites.length ? (
            <Container>
              {this.state.favorites.map(favorite => (

                <div className="row rounded favorite bg-dark text-secondary" key={favorite.id}>
                  <div className="col-2 py-5 px-3 pad">
                    <Link to={{
                      pathname: "/episodeList",
                      state: {
                        podcastId: favorite.podcastId,
                        podcastName: favorite.podcastName,
                        podcastLogo: favorite.podcastLogo,
                        loadMore: true
                      }
                    }}
                    >
                      <span><img id="podcastIcon" src={favorite.podcastLogo} alt="Podcast Logo" className="border-white" /></span>
                    </Link>
                  </div>

                  <div className="col-10 p-1">
                    <button
                      className="btn btn-sm mb-1 float-right"
                      onClick={() => this.handleFavoriteDelete(favorite.id)}
                    >
                      <img src={Delete} alt="delete" className="size" />
                    </button>

                    <Link to={{
                      pathname: "/listen",
                      state: {
                        podcastId: favorite.podcastId,
                        podcastName: favorite.podcastName,
                        podcastLogo: favorite.podcastLogo,
                        episodeId: favorite.episodeId,
                        episodeName: favorite.episodeName,
                        date: moment(favorite.date).format("LLL"),
                        description: favorite.description,
                        audioLink: favorite.audioLink
                      }
                    }}
                    >
                      <h4>{favorite.podcastName}</h4>
                      <p>{favorite.episodeName}</p>
                      <p>{moment(favorite.createdAt).format("LLL")}</p>

                      {/* <p>{favorite.podcastName}</p> */}
                      <div>
                        <p className="ellipsis">{favorite.description}</p>
                      </div>
                    </Link>

                  </div>
                </div>
              ))}
            </Container>
          ) : (
              <div className="col">
                <h5 className="text-center">&nbsp;{this.state.messageNoFav}</h5>
              </div>
            )}
        </div>
        <Row>
          <h4>Recent posts:</h4>
          {this.state.posts.length ? (
            <div className="container bg-dark">
              {this.state.posts.map(post => (
                <PostCard
                  key={post.id}
                  userId={post.postedBy}               
                  userName={this.state.user.name}
                  userImage={this.state.user.profileImage}
                  date={moment(post.createdAt).format("LLL")}
                  podcastId={post.podcastId}
                  podcastName={post.podcastName}
                  podcastLogo={post.podcastLogo}
                  episodeId={post.episodeId}
                  episodeName={post.episodeName}
                  description={post.description}
                  audioLink={post.audioLink}
                  userMessage={post.userMessage}
                  likes={post.numberOfLikes}
                  comments={post.numberOfComments}
                  postId={post.id}
                  handlePostDelete={this.handlePostDelete}
                  handleShowLikes={this.handleShowLikes}
                  handleLikeOrUnlike={this.handleLikeOrUnlike}
                />
              ))}
              <Modal
                open={this.state.showLikesModal}
                onClose={this.closeLikesModal}
                center
              >
                {this.state.likes.map(like => (
                  <div
                    className="row rounded favorite bg-dark text-secondary"
                    key={like.id}
                  >
                    <div className="col-3 mt-0">
                      <img
                        src={like.image}
                        alt="User Icon"
                        id="userImageLikesModal"
                        className="rounded border-white"
                      />
                    </div>
                    <div className="col-9">
                      <p>{like.name}</p>
                      <button
                        className="btn btn-outline-light bPosition"
                        onClick={(event) => {
                          event.preventDefault();
                          this.followUser(like.id)
                        }
                        }
                      >
                        Follow
                       </button>
                    </div>
                  </div>
                ))}
              </Modal>
            </div>
          ) : (
              <div className="col">
                <h5 className="text-center">
                  &nbsp;{this.state.messageNoPodcast}
                </h5>
              </div>
            )}
        </Row>
      </Container>
        </div>
        <div class="col-md-2 col-xs-0"></div>
      </Row>
      </div>    
      
    );
  }
}

export default Home;