import {
    actionBackToHomepage,
    notFoundSubtitle,
    notFoundTitle,
} from '@prezly/themes-intl-messages';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@/components/Button';
import Error from '@/components/Error';

import styles from './NotFound.module.scss';

const Layout = dynamic(() => import('@/modules/Layout'), { ssr: true });

const NotFound: FunctionComponent = () => {
    const router = useRouter();
    const { formatMessage } = useIntl();

    return (
        <Layout>
            <Error
                className={styles.error}
                action={
                    <Button onClick={() => router.push('/')} variation="primary">
                        <FormattedMessage {...actionBackToHomepage} />
                    </Button>
                }
                statusCode={404}
                title={formatMessage(notFoundTitle)}
                description={formatMessage(notFoundSubtitle)}
            />
        </Layout>
    );
};

export default NotFound;
