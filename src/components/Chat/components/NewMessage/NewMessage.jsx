
import PropTypes from 'prop-types';
import { InputBase, IconButton, Paper } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

function NewMessage(props) {
    
  const _onMessageEnter = (message) => {
    props.onEnterMessage(message);
  }  

  return (
    <Paper
      data-testid="new-message"
      className="chat-footer"
      component="form"
      id="new-message"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: '100%' }}
      onSubmit={(e) => {
          e.preventDefault();
          console.log(e.target);
          const val =  e.target.message.value;
          if(val) {
              _onMessageEnter(val);
              e.target.message.value = '';
          }
        }
    }
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        id="message"
        
        placeholder="Enter message text here..."
        autoComplete='off'
        inputProps={{ "aria-label": "Enter message text here", "data-testid":"message" }}
      />
      <IconButton type="submit" data-testid="send-message" sx={{ p: "10px" }} aria-label="Send">
        <SendIcon />
      </IconButton>
    </Paper>
  );
}

export default NewMessage;


NewMessage.prototype = {
    onEnterMessage: PropTypes.func,
}
