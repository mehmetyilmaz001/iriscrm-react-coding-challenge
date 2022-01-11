import { AppBar, Toolbar, Typography, Avatar } from '@mui/material';

import PropTypes from 'prop-types';

function ChatAppBar({user}) {
    
    return ( 
        <AppBar position="static" className="chat-header">
        <Toolbar>
        
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chat
          </Typography>
          
          <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
            <Avatar /> {user}
          </div>
          
        </Toolbar>
      </AppBar>
     );
}

export default ChatAppBar;

ChatAppBar.propTypes = { 
  user: PropTypes.string,
}