
import ProptyTypes from 'prop-types';
import { Modal, Box, Typography, Paper, TextField, Button } from '@mui/material';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    padding: 20
  };

function SigninModal({open, onSubmit}) {
  return (
    <Modal
      open={open}
    //   onClose={handleClose}
      disableEscapeKeyDown={true}
    >
      <Box style={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Please sign in to continue
        </Typography>

        <Paper 
            component="form" style={{display: 'flex', flexDirection: 'column', gap: 8}} 
            onSubmit={(e) => {
                e.preventDefault();
                const val =  e.target.name.value;
                onSubmit(val);
            }}
        >
            <TextField id="name" label="Name" variant="outlined" />
            <Button type="submit" variant="contained">Sign In</Button>
        </Paper>
        
      </Box>
    </Modal>
  );
}


export default SigninModal;

SigninModal.prototype = {
    open: ProptyTypes.bool,
    onSubmit: ProptyTypes.func
}