import React, { Component } from 'react';
import List from '@material-ui/core/List';
import { Card, CardBody, Row, Col, Spinner } from 'reactstrap';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Scheduler from 'devextreme-react/scheduler';
import moment from 'moment'

//Import links for Api
import links from '../apiLink.json'

//Import style
import './user.css'
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const views = ['day', 'workWeek', 'month'];

class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userDetails: [],
      singleUser: null,
      isopenUser: false
    }
  }

  componentDidMount() {
    this.AllUsers();
  }

  //Displaying details of all the user's
  AllUsers() {
    fetch(links.userDetailsApi, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(json => {
        if (json[0] === 200) {
          this.setState({ userDetails: json[1].members }, () => {
          });
        }
      })
      .catch(error =>
        this.setState(
          {
            error,
            isLoading: false
          },
          alert("Server unexpectedly lost the connection. Please try after some time."),

        ),
      );
  }

  handleListItemClick = (id) => {
    this.state.userDetails.map((val) => {
      if (val.id === id) {
        this.setState({ singleUser: val, isopenUser: true }, () => {
        })
        val.activity_periods.map((activeval) => {
          activeval.start = new Date(activeval.start);
          activeval.end = new Date(activeval.end);
          return null;
        })
      }
      return null;
    })
  };
  onCloseModal = () => {
    this.setState({ isopenUser: false })
  }

  render() {
    let userModal;

    if (this.state.isopenUser === true) {
      userModal = (
        <div>
          <Dialog
            open={this.state.isopenUser}
            maxWidth={'lg'}
            style={{ borderRadius: '32px', background: '#000000a6' }}
            fullWidth={true}
            onClose={this.onCloseModal}
            scroll={'paper'}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description">
            {this.state.singleUser !== null ? <div>
              <DialogTitle id="customized-dialog-title" onClose={this.onCloseModal}>
                {this.state.singleUser.real_name}
              </DialogTitle>
              <DialogContent dividers={true}>
                <Row>
                  <Col md="4">
                    <span className='user-present'>Today Login Details</span><br /><hr /><br />
                    <span className='user-present-date'>{moment(`Jul ${new Date().getDate()} 2020 10:34 AM +05:30`).format('MMM. DD,YYYY hh:mm A')} - {moment(`Jul ${new Date().getDate()} 2020 12:34 AM +05:30`).format('MMM. DD,YYYY hh:mm A')}</span><br /><br />
                    <span className='user-present-summary'>Meeting about review stocbloc application</span><hr />
                    <span className='user-present-date'>{moment(`Jul ${new Date().getDate()} 2020 1:34 AM +05:30`).format('MMM. DD,YYYY hh:mm A')} - {moment(`Jul ${new Date().getDate()} 2020 3:34 AM +05:30`).format('MMM. DD,YYYY hh:mm A')}</span><br /><br />
                    <span className='user-present-summary'>Exploring stocbloc application code</span><hr />
                    <span className='user-present-date'>{moment(`Jul ${new Date().getDate()} 2020 4:34 AM +05:30`).format('MMM. DD,YYYY hh:mm A')} - {moment(`Jul ${new Date().getDate()} 2020 8:34 AM +05:30`).format('MMM. DD,YYYY hh:mm A')}</span><br /><br />
                    <span className='user-present-summary'>Coding stocboc application using react framework and integrate with api</span><hr />
                  </Col>
                  <Col md="8">
                    <Scheduler
                      dataSource={this.state.singleUser.activity_periods}
                      views={views}
                      defaultCurrentView="day"
                      defaultCurrentDate={new Date()}
                      height={500}
                      startDayHour={7}
                      editing={false}
                      showAllDayPanel={false}
                      startDateExpr="start"
                      endDateExpr="end"
                      textExpr="title"
                    />
                  </Col>
                </Row>
              </DialogContent>
            </div> : null}
          </Dialog>
        </div>
      )
    }
    return (
      <div>
        <Row>
          <Col md="3" />
          <Col md="6">
            <span className="user-header">FULL THROTTLE LABS - User Login</span>
            <Card className='user-card'>
              <CardBody>
                <List>
                  {this.state.userDetails.length !== 0 ? this.state.userDetails.map((val, index) => {
                    return (
                      <div key={index}>
                        <ListItem button alignItems="flex-start"
                          onClick={(event) => this.handleListItemClick(val.id)}>
                          <ListItemAvatar>
                            <Avatar>{val.real_name.charAt(0).toUpperCase()}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={val.real_name}
                            secondary={
                              <React.Fragment>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="textPrimary"
                                >
                                  {val.field}
                                </Typography>
                                {` - ${val.tz}`}
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </div>
                    )
                  }) : <div><span className='spinner'><Spinner style={{ width: '2rem', height: '2rem' }} type="grow" /><span className='spinner-text'>Loading...</span></span></div>}
                </List>
              </CardBody>
            </Card>
          </Col>
          <Col md="3" />
        </Row>
        {userModal}
      </div>
    );
  }
}

export default User;
