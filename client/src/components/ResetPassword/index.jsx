import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    Grid,
    Form,
    Button,
    Segment,
    Message
} from 'semantic-ui-react';
import { checkToken, setNewPassword } from '../../containers/Profile/actions';


class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            invalidToken: false,
            successPasswordChange: false
        };
    }

    async componentDidMount() {
        const res = await this.props.checkToken(this.props.match.params.token);
        if (!res) {
            this.setState({
                invalidToken: true
            });
        }
    }


    handleSetNewPassword = async () => {
        const { password } = this.state;
        try {
            const res = await this.props.setNewPassword({
                token: this.props.match.params.token,
                password
            });
            if (res) {
                this.setState({
                    password: '',
                    successPasswordChange: true
                });
            }
        } catch {
            // TODO: show error
        }
    }

    render() {
        const { password, invalidToken, successPasswordChange } = this.state;
        return (
            <Grid textAlign="center" verticalAlign="middle" className="fill">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Form name="loginForm" size="large" onSubmit={this.handleSetNewPassword}>
                        <Segment>
                            {successPasswordChange
                                && (
                                    <Message positive>
                                        <Message.Header>
                                        Your password has been changed. You can try to log in using this
                                            {' '}
                                            <NavLink exact to="/login">link </NavLink>
                                        </Message.Header>
                                    </Message>
                                )}
                            <Form.Input
                                fluid
                                placeholder="Enter new password"
                                type="password"
                                value={password}
                                onChange={e => this.setState({ password: e.target.value })}
                            />
                            <Button type="submit" color="teal" fluid size="large" primary>
                                Change password
                            </Button>
                            {invalidToken
                                && (
                                    <Message negative>
                                        <Message.Header>Your token is invalid or expired. Please, use the link below</Message.Header>
                                    </Message>
                                )}
                            <Message>
                                Back to
                                {' '}
                                <NavLink exact to="/forgot">Forgot password</NavLink>
                                {' '}
                                page
                            </Message>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        );
    }
}

ResetPassword.propTypes = {
    checkToken: PropTypes.func.isRequired,
    setNewPassword: PropTypes.func.isRequired
};

const actions = {
    checkToken,
    setNewPassword
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
    null,
    mapDispatchToProps
)(ResetPassword);
