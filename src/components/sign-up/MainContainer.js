import styled from "styled-components";

export default styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  font-weight: 700;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;
