import React from 'react';
import { Avatar, Paper } from '@mui/material';
import { PropTypes } from 'prop-types';
import './ChatBuble.style.scss';

function ChatBuble({message, user, createDate, isOwner}) {
    const formattedDate = createDate ? new Date(createDate).toLocaleString(): new Date().toLocaleString();
    
    return ( 
        <>
            <div className={`chat-bubble ${isOwner && 'owner'} `} data-testid="chat-buble">
                <Avatar />
                <div className="content">
                    <span className="name">{user}</span>
                        <Paper className='message-paper'>
                            <span className='message'>{message}</span>
                            <span className='date'>{formattedDate}</span>
                        </Paper>
                    </div>
            </div>
        </>
     );
}

export default React.memo(ChatBuble);

ChatBuble.prototype = {
    name: PropTypes.string,
    message: PropTypes.string,
    createDate: PropTypes.string,
    isOwner: PropTypes.bool
}