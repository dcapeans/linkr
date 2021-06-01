import styled from "styled-components";

export default styled.div` 
width: 30vw;
background: #333;
font-weight: 700;
padding-top: 30vh; 
display: flex;
justify-content: center;   

form{
    max-width: 100%;
    height: auto;
    display flex;
    flex-direction: column;
    align-itens: center;
    align-text: center;
}
h1{
    font-weight: 400;
    font-size:20px;
    line-height: 24px;
    color: #fff;
    text-align: center;  
    text-decoration: underline;          
}
input{
    width: 429px;
    height: 65px;
    margin-bottom: 13px;
    border-radius: 6px;
    background: #fff;
    color: #9F9F9F;  
    padding-left: 13px; 
    font-size: 27px;
}    
button{
    width: 429px;
    height: 65px;
    border-radius: 6px;
    background: #1877F2;
    color: #fff;
    font-size: 27px;
    border: none;
    margin-bottom: 13px;        
}

@media(max-width: 600px) {
    width: 100vw;
    background: #333;
    height: calc(100vh - 175px);
    display flex;
    flex-direction: column;    
    padding-top: 20px;

    form{
        max-width: 100%;
        height: auto;
        display flex;
        flex-direction: column;
        align-text: center;
    }      
    input{
        width: 320px;        
        height: 55px;
        margin-bottom: 13px;  
        border-radius: 6px;
        background: #fff;
        color: #9F9F9F;   
        padding-left: 13px;
        font-size: 22px;
        margin-left: auto;
        margin-right: auto;
        }
    button{
        width: 320px;
        height: 55px;
        border-radius: 6px;
        background: #1877F2;
        color: #fff;
        font-size: 22px;
        border: none;
        margin-bottom: 21px; 
        margin-left: auto;
        margin-right: auto;       
        }
    h1{            
        font-size: 17px;        
        margin-bottom: 10px;
        }
    }
  }
`;
