import "./App.css";

function App() {
  const handleHighlight = () => {
    let range = window.getSelection().getRangeAt(0);
    let newNode = document.createElement("mark");
    range.surroundContents(newNode);
  };
  return (
    <div className="App">
      <div className="App-header">
        <p onMouseUp={() => handleHighlight()}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
          nostrum, dolores animi iusto eligendi, quos reiciendis dolore
          consequatur, laudantium deserunt qui voluptatibus modi! Repellat
          cupiditate distinctio laborum blanditiis quisquam ipsum incidunt!
          Explicabo totam voluptatem ab et! Nostrum voluptas veritatis quae
          facere dicta corrupti aliquid odit ratione libero earum. Ratione, non?
        </p>
        <a
          className="App-link"
          href="https://rachel-chen-tw.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Author: Rachel Chen
        </a>
      </div>
    </div>
  );
}

export default App;
