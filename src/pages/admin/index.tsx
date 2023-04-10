import Head from 'next/head';
import Link from 'next/link';
import { getTitle } from '../../utils';

export default function AdminHome() {
    return (
        <div className="factory">
            <Head>
                <title>{getTitle(`Admin`)}</title>
            </Head>
            <Link href="/admin/valve-factory">
                <button className="btn--outline">Manage Valve Factory</button>
            </Link>
            <Link href="/admin/prepayment-factory">
                <button className="btn--outline">Manage Prepayment Factory</button>
            </Link>
            <Link href="/admin/waterfall-factory">
                <button className="btn--outline">Manage Waterfall Factory</button>
            </Link>
        </div>
    );
}
