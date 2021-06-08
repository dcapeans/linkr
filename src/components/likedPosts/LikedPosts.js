import axios from "axios";
import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroller";

import Container from "../Container";
import Header from "../header/Header";
import UserContext from "../UserContext";

import Post from "../post/Post";
import PuffLoader from "../Loader";
import HashtagTrend from "../hashtag/HashtagTrend";
import FollowedContext from "../FollowedContext";

export default function LikedPosts() {
  const { user } = useContext(UserContext);
  const { followedUsers } = useContext(FollowedContext)
  const [posts, setPosts] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(10);

  useEffect(() => {
    getPosts(user.token);
  }, [user.token]);

  return (
    <>
      <Header avatar={user.user.avatar} followedUsers={followedUsers}/>
      <Container>
        <Text>my likes</Text>
        <HashtagTrend />
        {posts === null ? (
          <PuffLoader />
        ) : posts.length === 0 ? (
          <Text noPosts>Você ainda não curtiu nenhum post</Text>
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={() => getPosts(user.token, true)}
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
                likes={p.likes}
                getPosts={getPosts}
              />
            ))}
          </InfiniteScroll>
        )}
      </Container>
    </>
  );

  function getPosts(token, shouldUseOffset) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const req = axios.get(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/liked${
        !!shouldUseOffset ? `?offset=${offset}` : ""
      }`,
      config
    );
    req.then((r) => {
      if (shouldUseOffset) {
        if (r.data.posts.length === 0) {
          setHasMore(false);
          return;
        }
        setPosts([...posts, ...r.data.posts]);
        setOffset(offset + 10);
      } else {
        setPosts(r.data.posts);
      }
    });

    req.catch((r) => {
      alert("Houve uma falha ao obter os posts, por favor atualize a página!");
    });
  }
}

const Text = styled.p`
  font-family: "Oswald";

  font-size: ${({ noPosts }) => (noPosts ? "30px" : "43px")};
  color: ${({ noPosts }) => (noPosts ? "#bababa" : "#fff")};

  margin-left: ${({ noPosts }) => (noPosts ? "130px" : 0)};
  margin-top: ${({ noPosts }) => (noPosts ? "20px" : 0)};
  margin-bottom: 16px;

  @media (max-width: 611px) {
    font-size: 33px;

    margin-bottom: 16px;
    margin-left: 17px;
  }
`;
