import axios from "axios";
import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroller";
import useInterval from "../../helpers/useInterval";
import Container from "../Container";
import Header from "../header/Header";
import UserContext from "../UserContext";
import NewPost from "../post/NewPost";
import Post from "../post/Post";
import PuffLoader from "../Loader";
import HashtagTrend from "../hashtag/HashtagTrend";
import FollowedContext from "../FollowedContext";

export default function Timeline() {
  const { user } = useContext(UserContext);
  const { followedUsers, setFollowedUsers } = useContext(FollowedContext);
  const [posts, setPosts] = useState(null);


  const [hasMore, setHasMore] = useState(true);
  const olderLoadedPostId = posts === null ? null : posts[posts.length - 1].id;

  useEffect(() => {
    getPosts(user.token);
    getFollowedUsers(user.token);
  }, [user.token]);

  useInterval(() => {
    getPosts(user.token);
  }, 15000);

  function getPosts(token, older) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/following/posts${
      older ? `?olderThan=${older}` : ""
    }`;

    const req = axios.get(url, config);

    req.then((r) => {
      if (older) {
        if (r.data.posts.length === 0) {
          setHasMore(false);
          return;
        }
        setPosts([...posts, ...r.data.posts]);
      } else {
       
        checkForPostsUpdate(r.data.posts);
      }
    });

    req.catch((r) => {
      alert("Houve uma falha ao obter os posts, por favor atualize a página!");
    });
  }

  const getFollowedUsers = (token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };


    const request = axios.get(
      "https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/follows",
      config
    );
    request.then((res) => {
      setFollowedUsers(res.data.users);
    });
    request.catch((err) => {
      alert("Houve uma falha ao obter os posts, por favor atualize a página!");
    });
  };
  function checkForPostsUpdate(receivedPosts) {
    if (posts === null) {
      setPosts(receivedPosts);
    } else {
      const newPosts = [];

      receivedPosts.forEach((rp) => {
        let doPush = true;

        posts.forEach((p) => {
          if (!!rp.repostId) {
            if (p.repostId === rp.repostId) {
              doPush = false;
            }
          } else if (p.id === rp.id) {
            doPush = false;
          }
        });

        if (doPush) {
          newPosts.push(rp);
        }
      });

      setPosts([...newPosts, ...posts]);

    }
  }



  return (
    <>
      <Header avatar={user.user.avatar} followedUsers={followedUsers} />
      <Container>
        <Text>timeline</Text>
        <HashtagTrend></HashtagTrend>
        <NewPost getPosts={() => getPosts(user.token)} token={user.token} />
        {posts === null || followedUsers === null ? (
          <PuffLoader />
        ) : followedUsers.length === 0 ? (
          <Text noPosts>Você não segue ninguém ainda.</Text>
        ) : posts.length === 0 ? (
          <Text noPosts>Nenhuma publicação encontrada</Text>
        ) : (

          <InfiniteScroll
            pageStart={0}
            loadMore={() => getPosts(user.token, olderLoadedPostId)}
            hasMore={hasMore}
            loader={<PuffLoader />}
          >
            {posts.map((p) => (
              <Post
                key={p.id}
                postId={p.id}
                username={p.user.username}
                userId={p.user.id}
                avatar={p.user.avatar}
                text={p.text}
                link={p.link}
                linkTitle={p.linkTitle}
                linkDescription={p.linkDescription}
                linkImage={p.linkImage}
                getPosts={getPosts}
                likes={p.likes}
                reposts={p.repostCount}
                repostUser={p.repostedBy}
                setPosts={setPosts}
                posts={posts}
                comments={p.commentCount}
                followedUsers={followedUsers}
                user={user}
                geolocation={p.geolocation}
              />
            ))}
          </InfiniteScroll>

        )}
      </Container>
    </>
  );
}

const Text = styled.p`
  font-family: "Oswald";

  font-size: ${({ noPosts }) => (noPosts ? "30px" : "43px")};
  color: ${({ noPosts }) => (noPosts ? "#bababa" : "#fff")};

  margin-left: ${({ noPosts }) => (noPosts ? "130px" : 0)};
  margin-top: ${({ noPosts }) => (noPosts ? "20px" : 0)};
  margin-bottom: 45px;
  @media (max-width: 611px) {
    font-size: 33px;
    margin-bottom: 29px;
    margin-left: 17px;
  }
`;
