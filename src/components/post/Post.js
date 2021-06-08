import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import LinkInfo from "./LinkInfo";
import PostLike from "./PostLike";
import YoutubePlayer from "./YoutubePlayer";
import getYoutubeId from "get-youtube-id";
import PostRepost from "./PostRepost";
import Modal from "react-modal";
import axios from "axios";
import UserContext from "../UserContext";
import PostComment from "./PostComment";
import { FiSend } from "react-icons/fi";
import MapContainer from "./MapContainer";
import { IoMdPin } from "react-icons/io";
import { BiRepost } from "react-icons/bi";

export default function Post(props) {
  const {
    postId,
    username,
    userId,
    avatar,
    text,
    link,
    linkTitle,
    linkDescription,
    linkImage,
    getPosts,
    likes,
    reposts,
    followedUsers,
    geolocation,
    repostUser,
    comments,
  } = props;

  const youtubeId = link.includes("youtube") ? getYoutubeId(link) : null;
  const postText = highlightHashtags(text);
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [showRepost, setShowrepost] = useState(false);
  const { user } = useContext(UserContext);
  const [keyword, setKeyword] = useState("");

  const openRepost = () => {
    setShowrepost(true);
  };

  const closeRepost = (e) => {
    setShowrepost(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = (e) => {
    setShowModal(false);
  };

  return (
    <PostBox>
      {repostUser === undefined ? (
        ""
      ) : (
        <RepostInfo>
          <RepostIcon />
          <h1>
            Re-posted by
            <strong>
              {repostUser.id === user.user.id
                ? " you"
                : ` ${repostUser.username}`}
            </strong>
          </h1>
        </RepostInfo>
      )}

      <Div>
        <div>
          <Link to={`/user/${userId}`}>
            <img src={avatar} alt={username} />
          </Link>
          <PostLike
            likes={likes}
            postId={postId}
            isPostLiked={isPostLiked}
            setIsPostLiked={setIsPostLiked}
          />
          <PostComment
            postId={postId}
            comments={comments}
            visibility={visibility}
            setVisibility={setVisibility}
            setNotes={setNotes}
            getComments={getComments}
          />

          <PostRepost reposts={reposts} openRepost={openRepost} />
        </div>

        <DeletePost ownerId={userId} postId={postId} getPosts={getPosts} />

        <div>
          <UserLocation>
            <Link to={`/user/${userId}`}>
              <Name>{username}</Name>
            </Link>
            {geolocation !== undefined ? (
              <LocationIcon onClick={openModal} />
            ) : (
              ""
            )}
          </UserLocation>

          <EditPost
            ownerId={userId}
            text={text}
            postText={postText}
            postId={postId}
            highlightHashtags={highlightHashtags}
          />

          {youtubeId !== null ? (
            <YoutubePlayer
              linkTitle={linkTitle}
              link={link}
              youtubeId={youtubeId}
            />
          ) : (
            <LinkInfo
              linkTitle={linkTitle}
              linkDescription={linkDescription}
              link={link}
              linkImage={linkImage}
            />
          )}
        </div>

        <Modal
          isOpen={showRepost}
          style={modalStyle}
          onRequestClose={closeRepost}
          ariaHideApp={false}
        >
          <p>Do you want to re-post this link?</p>
          <ButtonContainer>
            <button className="back_button" onClick={(e) => closeRepost(e)}>
              No, cancel
            </button>
            <button className="delete_button" onClick={toRepost}>
              Yes, share!
            </button>
          </ButtonContainer>
        </Modal>

        <Modal
          isOpen={showModal}
          style={mapStyle}
          onRequestClose={closeModal}
          ariaHideApp={false}
        >
          <Title>
            <p>{username}'s location</p>
            <X onClick={(e) => closeModal(e)}>X</X>
            <X onClick={(e) => closeModal(e)}>X</X>
          </Title>

          <MapContainer geolocation={geolocation} />
        </Modal>
      </Div>
      {visibility === false ? (
        ""
      ) : (
        <Comments>
          {notes.length === 0 ? (
            <Note>
              <h3>Nenhum comentário ainda</h3>
            </Note>
          ) : (
            notes.map((item) => (
              <Note>
                <img src={item.user.avatar} alt={item.user.username} />
                <div className="texts">
                  <div className="author-info">
                    <h1>{item.user.username}</h1>
                    <h2>
                      {item.user.username === username
                        ? "• post’s author"
                        : followedUsers.includes(item.user.username)
                        ? "• following"
                        : ""}
                    </h2>
                  </div>
                  <h4>{item.text}</h4>
                </div>
              </Note>
            ))
          )}
          <CommentBar>
            <img src={user.user.avatar} alt={username} />
            <form onSubmit={postComment}>
              <input
                type="text"
                placeholder="write a comment"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />              
               <SendIcon onClick={postComment} />          
            </form>
          </CommentBar>
        </Comments>
      )}
    </PostBox>
  );

  function highlightHashtags(text) {
    let newText = text.split(" ");

    newText = newText.map((h, i) => {
      if (h.startsWith("#")) {
        return (
          <Hashtag key={i} to={`hashtag/${h.replace("#", "")}`}>
            {h}
          </Hashtag>
        );
      }
      return <span key={i}>{" " + h + " "}</span>;
    });

    return newText;
  }

  function postComment(e) {
    e.preventDefault();

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const body = { text: keyword };
    const req = axios.post(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${postId}/comment`,
      body,
      config
    );
    req.then((r) => {
      getComments();
      setKeyword("");
    });
    req.catch((r) => {
      alert("Houve um erro ao enviar o comentário");
    });
  }

  function getComments() {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const req = axios.get(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${postId}/comments`,
      config
    );

    req.then((r) => {
      setNotes(r.data.comments);
    });

    req.catch((r) => {
      alert("Não foi possivel carregar os comentários, tente novamente");
    });
  }

  function toRepost() {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const request = axios.post(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${postId}/share`,
      "",
      config
    );
    request.then((res) => {
      getPosts(user.token);
      closeRepost();
    });
    request.catch((resp) => {
      alert("Não foi possível repostar o post");
      closeRepost();
    });
  }
}
const mapStyle = {
  overlay: {
    width: "100%",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: "2",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    top: "20vh",
    margin: "0 auto",
    width: "790px",
    height: "354px",
    paddingLeft: "40px",
    paddingRight: "40px",
    backgroundColor: "#333",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "38px",
    fontWeight: "700",
  },
};
const PostBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const modalStyle = {
  overlay: {
    width: "100%",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: "2",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    top: "33vh",
    margin: "0 auto",
    width: "597px",
    height: "262px",
    backgroundColor: "#333",
    borderRadius: "50px",
    color: "#fff",
    fontSize: "30px",
    fontWeight: "700",
    textAlign: "center",
  },
};
const SendIcon = styled(FiSend)`
  position: absolute;
  width: 14px;
  height: 15px;
  right: 10px;
  bottom: 12px;
  color: #f3f3f3;
`;
const UserLocation = styled.div`
  height: 23px;
  display: flex;
`;
const X = styled.h1`
  color: #fff;
  font-size: 25px;
  position: absolute;
  left: 735px;
  top: 23px;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 38px;
  width: 100%;
  p {
    position: absolute;
    left: 40px;
    top: 20px;
  }
`;
const LocationIcon = styled(IoMdPin)`
  width: 16px;
  height: 19px;
  margin-right: 5px;
  color: #ffffff;
  margin-left: 8px;
  margin-top: 2px;
`;
const Comments = styled.div`
  width: 611px;
  background: #1e1e1e;
  border-radius: 16px;
  padding-top: 66px;
  padding-bottom: 25px;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 15px;
  margin-top: -63px;
  display: flex;
  flex-direction: column;
`;
const RepostIcon = styled(BiRepost)`
  width: 22px;
  height: 13px;
  font-weight: bold;
  margin-top: 10px;
`;
const RepostInfo = styled.div`
width: 611px;
display: flex;
align:itens: center;
line-height: 33px;
padding-bottom: 25px;
heigh: 50px;
padding-left: 13px;
margin-bottom: -55px;
margin-top: 38px;
background: #1e1e1e;
border-radius: 16px;
color: #fff;
font-family: "Lato";
font-size: 11px;

`;
const Note = styled.div`
  width: 571px;
  height: 71px;
  border-bottom: 1px solid #353535;
  display: flex;
  justify-content: left;
  align-itens: center;
  font-size: 14px;
  h1 {
    color: #f3f3f3;
    font-weight: 700;
    margin-right: 8px;
  }
  h2 {
    color: #565656;
    font-weight: 400;
  }
  h3 {
    display: flex;
    margin: 0 auto;
    color: #f3f3f3;
    font-weight: 700;
    line-height: 71px;
    text-align: center;
  }
  h4 {
    color: #acacac;
    font-size: 14px;
    font-weight: 400;
    width: 450px;
    margin-top: 4px;
  }
  .texts {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .author-info{
    display:flex;
  }
  img {
    width: 39px;
    height: 39px;
    margin-top: 16px;
    border-radius: 50%;
    margin-right: 13px;
  }
`;
const CommentBar = styled.div`
  display: flex;
  height: 39px;
  margin-top: 13px;
  position: relative;
  img {
    width: 39px;
    height: 39px;
    border-radius: 50%;
    margin-right: 13px;
  }
  input {
    font-family: "Lato";
    font-style: italic;
    width: 520px;
    border: none;
    height: 39px;
    padding-left: 13px;
    border-radius: 8px;
    background: #252525;
    color: #575757;
    font-size: 16px;
    position: relative;
  }
`;

const ButtonContainer = styled.div`
  button {
    width: 134px;
    height: 37px;
    font-size: 18px;
    border-style: none;
    border-radius: 5px;
    margin: 0 15px;
  }
  .back_button {
    color: #1877f2;
    background-color: #fff;
    cursor: pointer;
  }
  .delete_button {
    color: #fff;
    background-color: #1877f2;
    cursor: pointer;
  }
`;

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  min-height: 276px;
  width: 611px;
  background-color: #171717;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  padding: 16px 18px;
  margin-top: 29px;
  & > div:first-child {
    display: flex;
    width: 60px;
    flex-direction: column;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-bottom: 19px;
    }
    svg {
      width: 20px;
      height: 18px;
      color: #fff;
      margin-bottom: 4px;
      margin-top: 8px;
    }
    svg.liked {
      color: #ac0000;
    }
    p {
      width: 60px;
      font-family: "Lato";
      font-size: 11px;
      color: #fff;
      text-align: center;
    }
    & > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: calc(100% - 50px);
    }
    p {
      word-break: break-all;
      word-wrap: break-word;
    }
    a {
      word-break: break-all;
      word-wrap: break-word;
    }
  }
  & > div:last-child {
    width: 502px;
  }
  @media (max-width: 611px) {
    min-height: 232px;
    width: 100%;
    min-width: 320px;
    padding: 9px 15px;
    border-radius: 0px;
    margin-top: 16px;
    & > div:first-child {
      width: 50px;
      img {
        width: 40px;
        height: 40px;
        margin-bottom: 17px;
      }
      svg {
        width: 17px;
        height: 15px;
        margin-bottom: 12px;
      }
      p {
        font-size: 9px;
      }
    }
    & > div:last-child {
      width: calc(100% - 55px);
    }
  }
`;

const Name = styled.p`
  font-family: "Lato";
  font-size: 19px;
  color: #fff;
  margin-bottom: 10px;
  @media (max-width: 611px) {
    font-size: 17px;
    margin-bottom: 7px;
  }
`;

const Hashtag = styled(Link)`
  font-family: "Lato";
  font-size: 17px;
  font-weight: bold;
  color: #fff;
`;
