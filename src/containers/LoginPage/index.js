import React, { Component, PropTypes } from 'react'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import R from 'ramda'

import { userLogin } from '../../actions/global'
import { navbarSelect } from '../../actions/navbar'
import { loginValidation } from './validation'

import './styles.css'

class LoginPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      password: ''
    }
  }
  // This function is automatically called right after the component
  // is first rendered.
  componentDidMount () {
    $('.ui.form').form(loginValidation)
    $('#login-form').submit(() => {
      const isFormValid = $('#login-form').form('is valid')
      if (isFormValid) {
        this.props.onLogin(this.state)
      }
      // Needs to return false, so the browser is not redirected.
      return false
    })
  }

  componentDidUpdate () {
    const { whenLoggedIn, isLoggedIn } = this.props
    if (isLoggedIn) {
      whenLoggedIn()
    }
  }

  handleChange (prop) {
    return (event) => {
      this.setState({ [prop]: event.target.value }) // eslint-disable-line
    }
  }

  render () {
    return (
      <div className="ui middle aligned center aligned grid login-page-container">
        <div className="six wide column">
          <img src={require('../../img/tim_gradient.svg')} className="image" />

          <form id="login-form" className="ui large form" >
            <div className="ui stacked segment">
              <div className="field">
                <div className="ui left icon input">
                  <i className="user icon"></i>
                  <input onChange={this.handleChange('username')}
                         type="text" name="username" placeholder="Username" />
                </div>
              </div>
              <div className="field">
                <div className="ui left icon input">
                  <i className="lock icon"></i>
                  <input onChange={this.handleChange('password')}
                         type="password" name="password" placeholder="Password" />
                </div>
              </div>
              <div className={`ui fluid large green submit ${this.props.isFetching ? 'loading disabled' : ''} button`}>
                Login
              </div>
            </div>

            <div className="ui error message"></div>
          </form>

          <div className="ui message">
            First time using Tim? <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>
    )
  }
}

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
  whenLoggedIn: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  onLogin (credentials) {
    dispatch(userLogin(credentials))
  },
  whenLoggedIn () {
    browserHistory.push('/')
    dispatch(navbarSelect('RANKING'))
  }
})

const mapStateToProps = (state) => ({
  isLoggedIn: Boolean(R.path(['global', 'user', 'data'], state)),
  isFetching: R.path(['global', 'user', 'isFetching'], state)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)
