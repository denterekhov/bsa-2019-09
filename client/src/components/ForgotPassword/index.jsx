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
import { resetPassword } from '../../containers/Profile/actions';


class ForgotPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
        };
    }

    handleResetPassword = async () => {
        const { email } = this.state;
        try {
            const response = await this.props.resetPassword({ email });
            this.setState({ email: response });
        } catch {
            // TODO: show error
        }
    }

    render() {
        return (
            <Grid textAlign="center" verticalAlign="middle" className="fill">
                <Grid.Column style={{ maxWidth: 550 }}>
                    <Form name="loginForm" size="large" onSubmit={this.handleResetPassword}>
                        <Segment>
                            <Form.Input
                                fluid
                                icon="at"
                                iconPosition="left"
                                placeholder="Enter your email"
                                type="email"
                                value={this.state.email}
                                onChange={e => this.setState({ email: e.target.value })}
                            />
                            <Button type="submit" color="teal" fluid size="large" primary>
                                Reset password
                            </Button>
                            <Message>
                                Back to
                                {' '}
                                <NavLink exact to="/login">Login</NavLink>
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

ForgotPassword.propTypes = {
    resetPassword: PropTypes.func.isRequired
};

const actions = {
    resetPassword
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
    null,
    mapDispatchToProps
)(ForgotPassword);
