import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

export default function Popup(props) {
  console.log(props);
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [message, setMessage] = React.useState("");
  const [buttonText, setButtonText] = React.useState("");

  React.useEffect(() => {
    switch(props.type){
      case "settingsOk":
        {
          setMessage(props.message);
          setButtonText("OK");
          break;
        }
        default:
          break;
    }
  }, [props])

  const handleClose = () => {
    setOpen(false);
    props.closePopup();
  };
  
  const handleSubmit = () => {
    setOpen(false);
    props.closePopup(); 
  }

  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div>
              <h3>{message}</h3>
            </div>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {buttonText}
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}