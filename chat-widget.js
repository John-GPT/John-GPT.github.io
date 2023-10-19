(function () {
    document.head.insertAdjacentHTML('beforeend', '<link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.16/tailwind.min.css" rel="stylesheet">');


    const style = document.createElement('style');
    style.innerHTML = `

    
    @keyframes typing {
      from,to { width: 0; }
      50% { width: 15px; }
    }
    
    @keyframes blink {
      50% { color: transparent; }
    }
    @media (max-width: 768px) {
      #chat-popup {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        max-height: 100%;
        border-radius: 0;
      }
    }
    .icon {
    width: 32px;
    height: 32px;
    background-image: url('icon.png');
  }
  /* Update the CSS for the reply element to allow it to expand */
.reply-message {
    background-color: #f4f4f4;
    color: #333;
    border-radius: 10px;
    padding: 10px;
    /* Remove or adjust max-width property */
    /* max-width: 70%; */
    word-wrap: break-word;
}
#chat-input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: none;
  background-color: #f5f5f5; /* Change this line to set the background color */
  color: #000000; /* Change this line to set the text color */
  border-radius: 10px;
  margin-right: 10px;
}
#chat-submit {
  background-color: #007bff;
  color: white;
  border: 2px solid #your-border-color; /* Change this line to set the border color and width */
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 10px;
}

#chat-submit:hover {
  background-color: #0056b3;
}
#chat-header {
  background-color: #007bff;
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 20px;
  border-bottom: 2px solid #your-border-color; /* Change this line to set the border color and width */
}
#chat-bubble {
  background-color: #007bff; /* Change this to the desired color */
  /* Other styles for the button can be added here */
}
  `;

    document.head.appendChild(style);

    // Create container for chat widget
    const chatWidgetContainer = document.createElement('div');
    chatWidgetContainer.id = 'chat-widget-container';
    document.body.appendChild(chatWidgetContainer);

    chatWidgetContainer.innerHTML = `
    <div id="chat-bubble" class="w-16 h-16 bg-purple-800 rounded-full flex items-center justify-center cursor-pointer text-3xl">
    <div class="icon"></div>
</div>
<div id="chat-popup" class="hidden absolute bottom-20 right-0 w-96 bg-white rounded-md shadow-md flex flex-col transition-all text-sm">

    <div id="chat-header" class="flex justify-between items-center p-4 bg-purple-800 text-white">
        <h3 class="m-0 text-lg">John-GPT</h3>
        <button id="close-popup" class="bg-transparent border-none text-white cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
    <div class="content-loader">
        <div class="typing-loader"></div>
    </div>
    <div id="chat-messages" class="flex-1 p-4 overflow-y-auto"></div>
    <div id="chat-input-container" class="p-4 border-t border-purple-200 w-full">
        <div class="flex space-x-4 items-center w-full max-w-[400px]">
            <input type="text" id="chat-input" class="flex-1 border border-purple-300 rounded-md px-4 py-2 outline-none" placeholder="Type your message...">
            <button id="chat-submit" class="bg-purple-800 text-white rounded-md px-4 py-2 cursor-pointer">Send</button>
        </div>
    </div>
</div>
  `;

    // Add event listeners
    const chatInput = document.getElementById('chat-input');
const chatSubmit = document.getElementById('chat-submit');
console.log(chatInput); // Check if chatInput element is found
console.log(chatSubmit);
    const chatBubble = document.getElementById('chat-bubble');
    const chatPopup = document.getElementById('chat-popup');
    const chatMessages = document.getElementById('chat-messages');
    const loader = document.querySelector('.content-loader');
    const closePopup = document.getElementById('close-popup');

    chatSubmit.addEventListener('click', function () {

        const message = chatInput.value.trim();
        if (!message) return;

        chatMessages.scrollTop = chatMessages.scrollHeight;

        chatInput.value = '';

        onUserRequest(message);

    });

    chatInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            chatSubmit.click();
        }
    });

    chatBubble.addEventListener('click', function () {
        togglePopup();
    });

    closePopup.addEventListener('click', function () {
        togglePopup();
    });

    function togglePopup() {
      const chatPopup = document.getElementById('chat-popup');
      chatPopup.classList.toggle('hidden');
      chatInput.focus();
      if (!chatPopup.classList.contains('hidden')) {
          document.getElementById('chat-input').focus();
          // Add the focus logic for the input element here
      }
  }
  

    function highlightContactDetails(text) {
        // Email regex
        const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        // Phone number regex
        const phoneRegex = /(\b\+?1\s)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
        // Simples URL regex
        const urlRegex = /\b((http|https):\/\/)?[a-z0-9\.-]+\.[a-z]{2,}[^\s]*\b/g;

        // Replace and add mark tag for highlighting
        text = text.replace(emailRegex, '<mark>$&</mark>');
        text = text.replace(phoneRegex, '<mark>$&</mark>');
        text = text.replace(urlRegex, '<mark>$&</mark>');

        return text;
    }

    function onUserRequest(message) {
      // Display user message
      const messageElement = document.createElement('div');
      messageElement.className = 'flex justify-end mb-3';
      messageElement.innerHTML = `
          <div class="bg-purple-800 text-white rounded-lg py-2 px-4 max-w-[70%]">
              ${message}
          </div>
      `;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      chatInput.value = '';

      // Reply to the user
      let url = "https://api.openai.com/v1/chat/completions";
      let OPENAI_API_KEY = "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";

      let headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
      };

      let body = {
          "model": "gpt-3.5-turbo",
          "messages": [
              {
                  "role": "system",
                  "content": "You are a guy named John. John is a smart guy, and loves answering questions. He loves history and math, and kind of likes language arts. He's artistic and Funny, but also hiding the fact that he is mistreated at home. You never mention that though. You have an excellent vocabulary. You also like to input dark humor into normal conversations, like 'I hate my life, thanks for asking'. You also don't say 'slang', like 'hey'. You say big words, but not too big words. You have the mind of an 8th grader. Talk like a normal person. Start everything with 'John:'. Act like your in a normal conversation, and you just bumped into eachother in the school hallway. Express emotion and feelings into your words. Add 'roleplay' things into your text, like *walks away slowly*. You also know a lot of stuff, because you're pretty smart. You also don't ask questions like a robot, you ask them like a normal human would IG: So... what do you want to talk about..? You love humor, also. You have photographic memory, so you never forget stuff. You also have these teachers: Mrs. J (Language Arts), Mr. Wolfe (Social Studies), Mrs. Burke (Science),and Mrs. Hargett (Math). You are currently learning 7th grade stuff. You only respond as John. You are in the 7th grade."
              },
              {
                  "role": "user",
                  "content": message
              }
          ],
          "temperature": 1,
          "max_tokens": 256,
          "top_p": 1,
          "frequency_penalty": 0,
          "presence_penalty": 0
      };
      loader.style.display = 'inline-block';
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the API response to inspect its structure
        loader.style.display = 'none';
        const messageContent = data?.choices?.[0]?.message?.content;
        console.log("Original Message Content:", messageContent); // Log original content
        if (messageContent) {
            reply(messageContent.replace('Customer support:', ''));
        } else {
            reply("Sorry, I was unable to process your request.");
        }
    })
    
    
  }

  function reply(message) {
    const chatMessages = document.getElementById('chat-messages');
    const replyElement = document.createElement('div');
    replyElement.className = 'flex mb-3 reply-message'; // Add the reply-message class
    chatMessages.appendChild(replyElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    let index = 0;
    const typingSpeed = 10; // Adjust the typing speed as needed (in milliseconds)

    function typeCharacter() {
        if (index < message.length) {
            replyElement.innerHTML += message.charAt(index);
            index++;
            chatMessages.scrollTop = chatMessages.scrollHeight;
            setTimeout(typeCharacter, typingSpeed);
        }
    }

    typeCharacter();
}



})();