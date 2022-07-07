import translations from '@prezly/themes-intl-messages';
import { SocialShareButton } from '@prezly/themes-ui-components';
import { FormattedMessage } from 'react-intl';

import { IconFacebook, IconLinkedin, IconTwitter } from '@/icons';

import styles from './StoryShareSocial.module.scss';

interface Props {
    url: string;
}

function StoryShareSocial({ url }: Props) {
    return (
        <div className={styles.container}>
            <span className={styles.cta}>
                <FormattedMessage {...translations.actions.share} />
            </span>
            <SocialShareButton network="twitter" className={styles.button} url={url}>
                <IconTwitter width={24} height={24} className={styles.icon} />
            </SocialShareButton>
            <SocialShareButton network="facebook" className={styles.button} url={url}>
                <IconFacebook width={24} height={24} className={styles.icon} />
            </SocialShareButton>
            <SocialShareButton network="linkedin" className={styles.button} url={url}>
                <IconLinkedin width={24} height={24} className={styles.icon} />
            </SocialShareButton>
        </div>
    );
}

export default StoryShareSocial;
