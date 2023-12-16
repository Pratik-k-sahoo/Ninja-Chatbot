// Write the requirred javascript here
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const chatBotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const inputInitHeight = chatInput.scrollHeight;

let userMessage;
const API_KEY = "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";

const generateResponse = (incomeChatLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomeChatLi.querySelector("p");


  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "user",
          "content": userMessage
        }
      ]
    })
  }

  fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
    messageElement.textContent = data.choices[0].message.content;
  }).catch((error) => {
    messageElement.classList.add("error");
    messageElement.textContent = "Oops! Something went wrong. Please try again.";
  }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
}

//Outgoing message
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = className === "outgoing" ? `<div class="content">
  <p></p>
</div><span class="material-symbols-outlined">person_3</span>` : `<span class="material-symbols-outlined">sports_martial_arts</span>
  <div class="content">
          <p>${message}</p>
        </div>`;

  let prevChild = chatBox.children[chatBox.children.length - 1];
  if(prevChild.className == `chat ${className}`){
    const chatP = document.createElement("p");
    chatContent = `${message}`;
    chatP.textContent = chatContent;
    return chatP;
  }else{
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
  }
}

//chat input handle
const handleChat = () => {
  userMessage = chatInput.value.trim();
  console.log(userMessage);
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  if(!userMessage) return;

  let prevChild = chatBox.children[chatBox.children.length - 1];
  if(prevChild.className == `chat outgoing`){
    console.log(prevChild.firstChild);
    prevChild.firstChild.appendChild(createChatLi(userMessage, "outgoing"));
  }else{
    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
  }

  chatBox.scrollTo(0, chatBox.scrollHeight);

  setTimeout(() => {
    let prevChild = chatBox.children[chatBox.children.length - 1];
    if(prevChild.className == `chat incoming`){
      const incomeChatLi = createChatLi("Typing....", "incoming");
      console.log(prevChild.firstChild);
      prevChild.lastChild.appendChild(incomeChatLi);
      chatBox.scrollTo(0, chatBox.scrollHeight);
      generateResponse(incomeChatLi);
    }else{
      const incomeChatLi = createChatLi("Typing....", "incoming");
      chatBox.appendChild(incomeChatLi);
      chatBox.scrollTo(0, chatBox.scrollHeight);
      generateResponse(incomeChatLi);
    }
  }, 600);
}

//send button click
sendChatBtn.addEventListener("click", handleChat);


//Press Enter to run
chatInput.addEventListener("keypress", function(e){
  if(e.key == "Enter" && !e.shiftKey && window.innerWidth > 800){
    e.preventDefault();
    sendChatBtn.click();
  }
})

chatBotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
})