import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

function Mascot(): React.JSX.Element {
	const { t } = useTranslation();

	return (
		<Box
			id="mascot"
			sx={{
				py: { xs: 8, md: 10 },
				bgcolor: 'background.paper',
			}}
		>
			<Container maxWidth="lg">
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
						alignItems: 'center',
						gap: { xs: 4, md: 7 },
					}}
				>
					<Box>
						<Typography
							variant="h3"
							fontWeight={600}
							sx={{
								color: 'secondary.dark',
								fontSize: { xs: '2rem', md: '2.8rem' },
								lineHeight: 1.18,
								mb: 2,
							}}
						>
							{t('landing:mascot.title')}
						</Typography>
						<Typography
							variant="h6"
							sx={{
								color: 'text.secondary',
								lineHeight: 1.7,
								maxWidth: 560,
								fontSize: { xs: '1rem', md: '1.1rem' },
							}}
						>
							{t('landing:mascot.description')}
						</Typography>
					</Box>

					<Box
						sx={{
							display: 'flex',
							justifyContent: { xs: 'center', md: 'flex-end' },
						}}
					>
						<Box
							sx={{
								position: 'relative',
								width: '100%',
								maxWidth: { xs: 260, md: 360 },
							}}
						>
							<Box
								component={motion.img}
								src="/star2.svg"
								alt=""
								aria-hidden
								animate={{
									opacity: [0.35, 1, 0.45, 1],
									scale: [0.92, 1.06, 0.96, 1],
								}}
								transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
								sx={{
									position: 'absolute',
									left: { xs: '-2px', md: '10px' },
									top: { xs: '40px', md: '100px' },
									width: { xs: 20, md: 24 },
									height: 'auto',
								}}
							/>
							<Box
								component={motion.img}
								src="/star1.svg"
								alt=""
								aria-hidden
								animate={{
									opacity: [0.45, 1, 0.3, 1],
									scale: [0.9, 1.1, 0.95, 1],
								}}
								transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
								sx={{
									position: 'absolute',
									left: { xs: '-12px', md: '-20px' },
									top: { xs: '74px', md: '140px' },
									width: { xs: 30, md: 36 },
									height: 'auto',
								}}
							/>
							<Box
								component="img"
								src="/hello.svg"
								alt={t('landing:mascot.imageAlt')}
								sx={{
									width: '100%',
									maxWidth: { xs: 220, md: 310 },
									height: 'auto',
									display: 'block',
									mx: 'auto',
								}}
							/>
							<Box
								component={motion.img}
								src="/star1.svg"
								alt=""
								aria-hidden
								animate={{
									opacity: [0.4, 1, 0.5, 1],
									scale: [0.94, 1.07, 0.96, 1],
								}}
								transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
								sx={{
									position: 'absolute',
									right: { xs: '-8px', md: '28px' },
									top: { xs: '128px', md: '230px' },
									width: { xs: 28, md: 34 },
									height: 'auto',
								}}
							/>
							<Box
								component={motion.img}
								src="/star2.svg"
								alt=""
								aria-hidden
								animate={{
									opacity: [0.5, 1, 0.35, 1],
									scale: [0.95, 1.08, 0.93, 1],
								}}
								transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
								sx={{
									position: 'absolute',
									right: { xs: '2px', md: '10px' },
									top: { xs: '162px', md: '260px' },
									width: { xs: 18, md: 22 },
									height: 'auto',
								}}
							/>
						</Box>
					</Box>
				</Box>
			</Container>
		</Box>
	);
}

export default Mascot;
