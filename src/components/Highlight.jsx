import "./Highlight.css";
import defaultArea from "../data/defaultArea"
import React, { useState, useRef, useEffect, useMemo } from "react"
let article = `聽到一項「謠言」的時候，即使是很奇怪，非常可疑的消息，只要覺得很有趣，就一鼓作氣，將之傳播開來，我對於這種人，就算是名人，也會冷眼對待。 ---《為什麼孩子要上學》`

function Highlight() {
  // State
  const startTag = useRef(null)
  const [area, setArea] = useState([])
  const [computedRange, setComputedRange] = useState([])
  const [showComputedRange, setShowComputedRange] = useState(true)

  // Functions
  let methods = {
    // 1.
    fetchContent: () => {
      // 1. set 非同步，不再做同步操作 // [4, 6, 10, 10]
      methods.resetToDefault()
    },
    // 2.
    resetToDefault: () => {
      if (defaultArea.length < 2 || defaultArea.length % 2 !== 0) return
      methods.setComputedHighlightRange(defaultArea)
      setArea(defaultArea)
    },
    
    // View
    renderComponent: useMemo(() => {
      // Clear
      if(area.length < 2) {
        let innerContentOriginal = article
        return <span dataid={0}>{innerContentOriginal}</span>
      }
      // Has highlight
      return area.map((number, index) => {
        if (index === 0 && number !== 0) {
          let innerContentOriginal = article.slice(0, number)
          let innerContentMarked = article.slice(number, area[index + 1] + 1)

          return <React.Fragment key={Math.random()}><span key={0 * Math.random()} dataid={0}>{innerContentOriginal}</span><span key={number * Math.random()} dataid={number} className="highlight-text">{innerContentMarked}</span></React.Fragment>
        } else if (index === 0 && number === 0) {
          let innerContentMarked = article.slice(0, area[index + 1] + 1)
          return <span key={number * Math.random()} dataid={number} className="highlight-text">{innerContentMarked}</span>
        }
        // [1,6,7,8] area,num
        if (index !== 0 && index % 2 === 0) {
          let innerContentOriginal = article.slice(area[index - 1] + 1, number)
          let innerContentMarked = article.slice(number, area[index + 1] + 1)

          return <React.Fragment key={Math.random()}><span key={area[index - 1] + 1} dataid={area[index - 1] + 1}>{innerContentOriginal}</span><span key={number * Math.random()} dataid={number} className="highlight-text">{innerContentMarked}</span></React.Fragment>
        }

        if (index === area.length - 1) {
          let restInnerContentOriginal = article.slice(area[area.length - 1] + 1, article.length)
          if (restInnerContentOriginal.length > 0) {
            return <span key={area[area.length - 1] + 1} dataid={area[area.length - 1] + 1}>{restInnerContentOriginal}</span>
          }
        }
      })


    }, [area]),

    // Get Selection
    getHighlightRange: (e) => {
      let highlightRange = []

      if (window.getSelection) {
        // 不論span裡面或不是span裡面
        const sel = window.getSelection();
        if (!sel || sel.isCollasped) return
        const range = sel.getRangeAt(0);
        let exactText = sel.toString().replace(/<(.|\n)*?>/g, '');
        if (exactText.length === 0) return
        const startTagDataId = Number(startTag.current.getAttribute("dataid"))
        const startHighlightIndex = startTagDataId + range.startOffset
        highlightRange[0] = startHighlightIndex
        highlightRange[1] = startHighlightIndex + exactText.length - 1
      }
      return highlightRange
    },
    computeHighlightRange: (highlightRange) => {
      let result = []

      // [4, 6, 9, 10, 11, 18] area[secondIndex]
      // [5,15] 2
      // [4,15,11,18]
      // 沒有重疊，有重疊
      // index 0
      area.forEach((num, index) => {
        if (result.length > 0) {
          return result
        }

        // 有重疊
        if (index % 2 === 0 && highlightRange[0] >= num && highlightRange[0] <= area[index + 1]) {
          if (highlightRange[0] === highlightRange[1]) {
            result = [...area]
            return result
          }  // 只選擇一個字

          let firstIndex = index
          let secondIndex
          let insertValue
          area.forEach((num, index) => {
            if (insertValue !== undefined) {
              return
            }
            if (index % 2 === 1 && highlightRange[1] < num) {
              secondIndex = index - 2
              if (highlightRange[1] === area[secondIndex]) {
                insertValue = area[secondIndex]
              } else if (highlightRange[1] > area[secondIndex]) {
                insertValue = highlightRange[1]
              }
            }
          })

          if (secondIndex === undefined) {
            result = [...area.splice(0, firstIndex + 1), highlightRange[1]]
          } else {
            result = [...area.splice(0, firstIndex + 1), insertValue, ...area.splice(secondIndex)]
          }

          return result
        }
      })

      area.forEach((num, index) => {
        if (result.length > 0) {
          return result
        }
        // 沒有重疊

        let firstIndex = index // 0
        let secondIndex
        let insertValue
        if (highlightRange[0] > num) {
          result = [...area, ...highlightRange]
          return result
        }
        // [4, 6, 9, 10]
        // [2,7,9,10]
        area.forEach((num, latterIndex) => {
          if (insertValue !== undefined) {
            return
          }
          if (latterIndex % 2 === 1 && highlightRange[1] <= num) {
            if ((area[latterIndex - 1] - highlightRange[1]) <= 1) {
              secondIndex = latterIndex + 1
              insertValue = num
            } else {
              secondIndex = latterIndex - 1
              insertValue = highlightRange[1]
            }
          }
        })
        if (secondIndex === undefined) {
          result = [...area.splice(0, firstIndex), highlightRange[0], highlightRange[1]]
        } else {
          result = [...area.splice(0, firstIndex), highlightRange[0], insertValue, ...area.splice(secondIndex)]
        }
        return result


      })
      return result
    },
    // State
    clearHighlight:() => {
      setArea([])
      setComputedRange([])
    },
    removeHighlight:(e) => {
      const dataId = Number(e.target.getAttribute("dataid"))
      const targetIndex = area.findIndex(num => num === dataId)
      const cloneArea = [...area]
      cloneArea.splice(targetIndex, 2)
      setArea(cloneArea)
    },
    setStartTagOfHighlight: (e) => {
      startTag.current = e.target
    },
    setComputedHighlightRange: (computedHighlightRange) => {
      setComputedRange(computedHighlightRange)
    },
    renewArea: (computedHighlightRange) => {
      setArea(computedHighlightRange) // defaultArea -> computedHighlightRange
    },
    showComputedRange: () => {
      setShowComputedRange(!showComputedRange)
    },
    // Compute State
    handleHighlight: (e) => {
      let highlightRange = methods.getHighlightRange(e) // input:e, output: [5,11]

      if (highlightRange?.length !== 2) return
      {
        let computedHighlightRange
        if (area.length < 2) {
          setArea([])
          computedHighlightRange = [...highlightRange]
        } else {
          computedHighlightRange = methods.computeHighlightRange(highlightRange)// [1,5] [6,7]
        }
        methods.setComputedHighlightRange(computedHighlightRange)
        methods.renewArea(computedHighlightRange) // [1,5,6,7]
      }
    },
  }

  useEffect(() => {
    methods.fetchContent()
  }, [])

  return (
    <div className="App-default" >
      <div>
        <h2>Select and highlight text</h2>
        <p className="paragraph" onMouseDown={(e) => methods.setStartTagOfHighlight(e)} onMouseUp={(e) => methods.handleHighlight(e)} onClick={(e) => methods.removeHighlight(e)}>
            {methods.renderComponent}
          </p>
      </div>
      <div>
        {
          showComputedRange && computedRange.length ? (  <div>
          [
          {
            computedRange.map((data, index) => {
              return (<React.Fragment><span key={index}>{index === computedRange.length - 1 ? `${data}` : `${data}, `}</span></React.Fragment>)
            })
          }
          ]
        </div>) : null
        }
      </div>
      <div className="button-list">
        <button type="button" onClick={() => methods.showComputedRange()}>
          {showComputedRange ? `Hide Computed Highlight Range` : `Show Computed Highlight Range`}
        </button>
        <button type="button" onClick={() => methods.clearHighlight(true)}>
          Clear Highlight Area
        </button>
        <button type="button" onClick={() => methods.resetToDefault()}>
          Reset To Default
        </button>
      </div>
    </div>
  );
}

export default Highlight;
