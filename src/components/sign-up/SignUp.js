import MainContainer from "./MainContainer";
import PagePresentation from "./PagePresentation";
import FormContainer from "./FormContainer";
import React, { useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [pictureUrl, setPictureurl] = useState("");
  const [disabled, setDisabled] = useState(false);
  let history = useHistory();

  function register(e) {
    e.preventDefault();

    setDisabled(true);

    const body = { email, password, username, pictureUrl };

    const request = axios.post(
      "https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/sign-up",
      body
    );

    request.then((e) => history.push("/"));

    request.catch((e) => {
      setDisabled(false);
      alert("Erro: " + e.response.status + ", " + e.response.data.message);
    });
  }

  return (
    <MainContainer>
      <PagePresentation>
        <h1>linkr</h1>
        <h2>save, share and discover the best links on the web</h2>
      </PagePresentation>

      <FormContainer>
        <form onSubmit={register}>
          <input
            type="email"
            required
            placeholder="email"
            disabled={disabled}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder="password"
            disabled={disabled}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="text"
            required
            placeholder="username"
            disabled={disabled}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="url"
            required
            placeholder="picture url"
            disabled={disabled}
            value={pictureUrl}
            onChange={(e) => setPictureurl(e.target.value)}
          />

          <button type="submit" disabled={disabled}>
            Sign Up
          </button>

          <Link to={"/"}>
            {" "}
            <h1>Switch back to log in</h1>{" "}
          </Link>
        </form>
      </FormContainer>
    </MainContainer>
  );
}
