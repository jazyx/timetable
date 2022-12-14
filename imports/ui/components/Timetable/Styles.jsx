/**
 * Styles.jsx
 *
 * Provides StyledGrid and StyledSlot, which are used by the Grid
 * component.
 */


import styled from "styled-components"


/** props = {
 *    hourLine: integer line on which first full hour starts
 *    rows:     integer total number of rows
 *    columns:  integer number of columns
 *  }
 */
export const StyledGrid = styled.div`
  --full-height: 85vh; /* TO BE CALCULATED */
  --line-color: #666;
  --even-color: #ffffff08;
  --time-color: #1119;

  border: 2px solid var(--line-color);
  display: flex;
  pointer-events: none;

  & * {
    box-sizing: border-box;
  }

  /* Enable child slots to react to drag */
  &.dragging {
    pointer-events: all;

    /* Don't allow drop on an existing session */
    & div.session {
      pointer-events: none;
    }
  }

  /* Styling of day columns */
  & > div {
      border-left: 1px solid var(--line-color);

    /* height and width */
    & div { /* Depends on the number of columns and borders*/
      // --columns: ${props => props.columns};
      // --borders: calc((var(--columns) + 3)px);
      // width: calc((100vw - var(--borders)) / var(--columns));
      width: calc((100vw - 10px) / 8);
    }

    /* Styling of 5-minute slots */
    & > div {
      height: calc(var(--full-height) / ${props => props.rows});
    }

    /* Date header */
    & > div:first-child {
      text-align: center;
      line-height: 2em;
      height: 2em;
      border-bottom: 2px solid var(--line-color);
      overflow: hidden;
    }

    /* Alternate row colours */
    & > div:nth-child(even) {
      background-color: var(--even-color);
    }

    /* hour line */
    & > div:nth-child(12n+${props => props.hourLine + 1}) {
      border-bottom: 1px solid var(--line-color);
    }
  }

  /* No day border to duplicate week border */
  & > div:first-child {
    border-left: none;
  }
`


/**
 * props = {
 *    before: integer hour to show
 *  }
 */
export const StyledSlot = styled.div`
  position: relative; /* because ::before is absolute */

  ${props => {
    let extraCSS = ""

    // Show time as ::before, if props.before is present
    if (props.before !== "") {
      extraCSS += `
      &::before {
        content: "${props.before}:00";
        display: inline-block;
        position: absolute;
        width: 3em;
        left: -1.5em;
        font-family: monospace;
        text-align: center;
        background-color: var(--time-color);
        z-index: 2;
      }`
    }

    return extraCSS
  }}
`