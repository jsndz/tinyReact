
const input = document.getElementById("input");
const renderButton = document.getElementById("render-button");
const output = document.getElementById("output") ;

renderButton.addEventListener("click", async () => {
  const code = input.value;


  const response = await fetch("http://localhost:3000/api/render", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  const data = await response.json();
  console.log("API response:", data);
  output.innerHTML = data.html;
});

