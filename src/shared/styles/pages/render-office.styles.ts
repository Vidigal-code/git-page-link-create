import styled from 'styled-components';

export const OfficeWrapper = styled.div`
  width: 100%;
  height: 70vh;
  min-height: 520px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.cardBackground};
`;

export const OfficeFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  background: #fff;
`;

export const FullScreenOfficeFrame = styled.iframe`
  width: 100vw;
  height: 100vh;
  border: none;
  background: #fff;
`;

export const DocxContent = styled.div`
  margin-top: 20px;
  padding: 40px;
  background: #fff;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  line-height: 1.6;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  overflow-x: auto;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    color: #000;
  }
  
  p {
    margin-bottom: 1em;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1em;
  }
  
  table, th, td {
    border: 1px solid #ccc;
  }
  
  th, td {
    padding: 8px;
    text-align: left;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
`;
