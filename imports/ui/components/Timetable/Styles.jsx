import styled from "styled-components"



/** props = {
 *    hourLine: integer line on which first full hour starts
 *    rows:     integer total number of rows
 *    columns:  integer number of columns
 *  }
 */
export const StyledWeek = styled.div`
  --full-height: 85vh; /* TO BE CALCULATED */

  border: 2px solid black;
  display: flex;

  & * {
    box-sizing: border-box;
  }

  & > div {
      border-left: 1px solid black;
  
    & div { /* Depends on the number of columns and borders*/
      // --columns: ${props => props.columns};
      // --borders: calc((var(--columns) + 3)px);
      // width: calc((100vw - var(--borders)) / var(--columns));
      width: calc((100vw - 10px) / 7);
    }

    & > div {
      height: calc(var(--full-height) / ${props => props.rows});
    }

    & > div:first-child {
      text-align: center;
      height: 1em;
      border-bottom: 2px solid black;
    }

    & > div:nth-child(even) {
      background-color: #00000008;
    }

    & > div:nth-child(12n+${props => props.hourLine + 1}) {
      border-bottom: 1px solid grey;
    }
  }

  & > div:first-child {
    border-left: none;
  }
`


export const StyledTime = styled.div`
  position: relative; /* because ::before is absolute */

  &::before {
    content: "${props => props.before}:00";
    display: inline-block;
    position: absolute;
    width: 3em;
    left: -1.5em;
    font-family: monospace;
    text-align: center;
    background-color: #fff9;
    z-index: 2
  }
`


export const StyledCell = styled.div`
  position: relative;
`