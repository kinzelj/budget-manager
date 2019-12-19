import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ViewTransactions from './ViewTransactions';
import FileUpload from './FileUpload';
import Home from './Home';

const drawerWidth = 275;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const getNavOptions = () => ({
  options: [
  	{ text: "Home", icon: "large home icon"},
  	{ text: "View Transaction Data", icon: "large database icon"},
  	{ text: "Import Data", icon: "large upload icon"},
  	{ text: "Analysis", icon: "large table icon"},
  ]
})

export default function MiniDrawer() {
  const classes = useStyles();
  const navOptions = getNavOptions().options;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [navSelect, setSelect] = React.useState('Home');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const handleMenuClick = (value) => {
    setSelect(value);
  }
  
  const getContent = () => {
    switch( navSelect ) {
      case ('View Transaction Data'):  
      	return(<ViewTransactions handleRedirect={handleMenuClick}/>);
     	case ('Import Data'): 
        console.log('test');
        return(<FileUpload handleRedirect={handleMenuClick}/>);
       case ('Analysis'):
      default:
        return(<Home/>);
    }
  }
  

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
  
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
           <i className="bars icon"></i>
          </IconButton>
                       
          <Typography variant="h6" noWrap>
           MY BUDGET MANAGER
          </Typography>
                       
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <i className="chevron right icon"></i> : <i className="chevron left icon"></i>}
          </IconButton>
        </div>

        <List>
          {navOptions.map((option, index) => (
            <ListItem button onClick={() => handleMenuClick(option.text)} value={option.text} key={option.text}>
              <ListItemIcon>{<i className={option.icon} style={{marginLeft: '10px'}}></i>}</ListItemIcon>
              <ListItemText primary={option.text} />
            </ListItem>
          ))}
        </List>

      </Drawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />
          {getContent()}
      </main>

    </div>
  );
}