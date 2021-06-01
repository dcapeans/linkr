import styled from "styled-components";

export default styled.div`
    min-width: 70vw;
    background: #151515;
    font-weight: 700;
    padding-left: 10vw;
    padding-top: 30vh; 
    color: #fff;
    padding-left: 10vw;
    
    h1{
        font-family: 'Passion One', cursive;
        font-size:106px;
        line-height: 117px;        
    }
    h2{
        font-size: 43px;
        line-height: 64px;
        font-family: 'Oswald', sans-serif;
        width: 442px;
        height: 128px;
    }
    @media(max-width: 600px) {
        width: 100vw;
        padding-top: 10px;
        height: 175px;
        display flex;
        flex-direction: column;
        align-itens: center;
        align-text: center;
        padding-left: 0;

        h1 {
            font-size: 76px;
            line-height: 84px;   
            text-align: center;     
        }
        h2{
            font-size: 23px;
            line-height: 34px;
            width: 237px;
            margin: 0 auto;
            height: auto;
            text-align: center; 
        }
    }
`;
