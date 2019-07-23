import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Segment } from 'semantic-ui-react';

import styles from './styles.module.scss';

const RestorePost = (props) => {
    const { deletedPosts, restorePost } = props;
    return (
        <>
            {deletedPosts && deletedPosts.length
                ? (
                    <Segment>
                        <Menu.Menu position="right">
                            {deletedPosts.map(post => (
                                <Menu.Item
                                    as="a"
                                    className={styles.link}
                                    key={post.deletedAt}
                                    onClick={() => restorePost(post.id)}
                                >
                                    Restore your post deleted at
                                    {' '}
                                    {new Date(post.deletedAt).toLocaleString()}
                                </Menu.Item>
                            ))}
                        </Menu.Menu>
                    </Segment>
                )
                : null
            }
        </>
    );
    // }
};

RestorePost.propTypes = {
    deletedPosts: PropTypes.arrayOf(PropTypes.object),
    restorePost: PropTypes.func.isRequired,
};

RestorePost.defaultProps = {
    deletedPosts: undefined
};

export default RestorePost;
