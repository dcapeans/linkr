import axios from "axios";
import { useEffect, useState, useContext } from "react";
import styled from "styled-components";

import Container from "../Container";
import Header from "../header/Header";
import UserContext from "../UserContext";

import Post from "../post/Post";
import PuffLoader from "../Loader";
import HashtagTrend from "../hashtag/HashtagTrend";
import InfiniteScroll from "react-infinite-scroller";

export default function MyPosts() {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(10);
  console.clear();
  console.log(offset);

  useEffect(() => {
    getPosts(user.token);
  }, [user.token]);

  return (
    <>
      <Header avatar={user.user.avatar} />
      <Container>
        <Text>my posts</Text>
        <HashtagTrend />
        {posts === null ? (
          <PuffLoader />
        ) : posts.length === 0 ? (
          <Text noPosts>Nenhum Post encontrado</Text>
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
                getPosts={getPosts}
                likes={p.likes}
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
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${
        user.user.id
      }/posts${!!shouldUseOffset ? `?offset=${offset}` : ""}`,
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
  margin-bottom: 45px;

  @media (max-width: 611px) {
    font-size: 33px;

    margin-bottom: 29px;
    margin-left: 17px;
  }
`;
