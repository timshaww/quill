import ChatWrapper from '@/components/ChatWrapper';
import PdfRenderer from '@/components/PdfRenderer';
import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound, redirect } from 'next/navigation';

interface PageProps {
	params: {
		fileid: string;
	};
}

const page = async ({ params }: PageProps) => {
	const { fileid } = params;

	const { getUser } = getKindeServerSession();
	const user = await getUser();

	if (!user || !user.id)
		redirect(`/auth-callback?origin=dashboard/${fileid}`);

	const file = await db.file.findFirst({
		where: {
			id: fileid,
			userId: user.id,
		},
	});

	if (!file) notFound();

	return (
		<div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem]'>
			<div className='mx-auto w-full max-w-8xl lg:flex xl:px-2'>
				{/* Left side */}
				<div className='flex-1 lg:flex'>
					<div className='px-4 py-6 sm:px-6 lg:pl-8 xl:pl-6 xl:flex-1'>
						<PdfRenderer url={file.url} />
					</div>
				</div>

				{/* Chat */}
				<div className='shrink flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-1 lg:border-t-0'>
					<ChatWrapper />
				</div>
			</div>
		</div>
	);
};

export default page;
