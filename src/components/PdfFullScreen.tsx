import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Expand, Loader2 } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import { Document, Page } from 'react-pdf';
import { useToast } from './ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';

interface PdfFullScreenProps {
	fileUrl: string;
}

const PdfFullScreen = ({ fileUrl }: PdfFullScreenProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const { toast } = useToast();

	const [numPages, setNumPages] = useState<number>();

	const { width, ref } = useResizeDetector();
	return (
		<Dialog
			open={isOpen}
			onOpenChange={(v) => {
				if (!v) {
					setIsOpen(v);
				}
			}}
		>
			<DialogTrigger asChild onClick={() => setIsOpen(true)}>
				<Button
					className='gap-1.5'
					variant='ghost'
					aria-label='fullscreen'
				>
					<Expand className='size-4' />
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-7xl w-full'>
				<SimpleBar
					autoHide={false}
					className='max-h-[calc(100vh-10rem)]'
				>
					<div ref={ref}>
						<Document
							file={fileUrl}
							className='max-h-full'
							loading={
								<div className='flex justify-center'>
									<Loader2 className='my-24 size-6 animate-spin' />
								</div>
							}
							onLoadError={() => {
								toast({
									title: 'Error loading PDF',
									description: 'Please try again later',
									variant: 'destructive',
								});
							}}
							onLoadSuccess={({ numPages }) => {
								setNumPages(numPages);
							}}
						>
							{new Array(numPages).fill(0).map((_, i) => (
								<Page
									key={i}
									width={width ? width : 1}
									pageNumber={i + 1}
								/>
							))}
						</Document>
					</div>
				</SimpleBar>
			</DialogContent>
		</Dialog>
	);
};

export default PdfFullScreen;
