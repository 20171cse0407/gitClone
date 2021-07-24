import React from 'react';
import axios from 'axios';
import TableRow from '@material-ui/core/TableRow';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Paper
} from '@material-ui/core/Table';

import { withStyles,makeStyles } from '@material-ui/styles';
const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    }
  }
}))(TableRow);
const useStyles = theme=>({
  table: {
    minWidth: 700
  }
});

const url = 'https://jsonplaceholder.typicode.com/posts';
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      id: '',
      userId: '',
      title: '',
      body: '',
      posts: []
    };
  }
  componentDidMount() {
    this.getPosts();
  }
  //CREATE
  createPosts = async () => {
    const { data } = await axios.post(url, {
      userId: this.state.userId,
      title: this.state.title,
      body: this.state.body
    });
    const posts = [...this.state.posts];
    posts.push(data);
    this.setState({ posts, userId: '', title: '', body: '' });
  };
  //READ
  getPosts = async () => {
    const { data } = await axios.get(url);
    this.setState({ posts: data });
  };
  //UPDATE
  updatePost = async () => {
    const { data } = await axios.put(`${url}/${this.state.id}`, {
      userId: this.state.userId,
      title: this.state.title,
      body: this.state.body
    });
    const posts = [...this.state.posts];
    const postIndex = posts.findIndex(post => post.id === this.state.id);
    posts[postIndex] = data;
    this.setState({ posts, userId: '', title: '', body: '', id: '' });
  };
  //DELETE
  deletePosts = async postId => {
    await axios.delete(`${url}/${postId}`);

    let posts = [...this.state.posts];
    posts = posts.filter(post => post.id != postId);
    this.setState({ posts });
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };
  handleSubmit = event => {
    event.preventDefault();
    if (this.state.id) {
      this.updatePost();
    } else {
      this.createPosts();
    }
  };

  selectPost = post => {
    this.setState({ ...post });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <h1>MYBlog!</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>User Id: </label>
            <input
              type="text"
              name="userId"
              value={this.state.userId}
              onChange={this.handleChange}
              required
            />
          </div>
          <br />
          <div>
            <label>Title: </label>
            <input
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
              required
            />
          </div>
          <br />
          <div>
            <label>Body: </label>
            <input
              type="text"
              name="body"
              value={this.state.body}
              onChange={this.handleChange}
              required
            />
          </div>
          <br />
          <div>
            <input type="submit" />
          </div>
          <br />
        </form>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Id</StyledTableCell>
                <StyledTableCell>User ID</StyledTableCell>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Body</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.posts.map(post => {
                return (
                  <StyledTableRow key={post.id}>
                    <StyledTableCell>{post.id}</StyledTableCell>
                    <StyledTableCell>{post.userId}</StyledTableCell>
                    <StyledTableCell>{post.title}</StyledTableCell>
                    <StyledTableCell>{post.body}</StyledTableCell>
                    <StyledTableCell>
                      <button onClick={() => this.selectPost(post)}>
                        Edit{' '}
                      </button>
                      <button onClick={() => this.deletePosts(post.id)}>
                        Delete{' '}
                      </button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}
export default withStyles(useStyles,
  {withTheme:true})(App)