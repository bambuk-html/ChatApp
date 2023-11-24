function Message({ message }) {
    return (
      <div>
        <p><strong>{message.username}</strong>: {message.message}</p>
      </div>
    );
  }
  
  export default Message;