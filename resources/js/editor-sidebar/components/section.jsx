/**
 * WordPress dependencies
 */
import {
	__experimentalVStack as VStack,
	__experimentalHeading as Heading,
} from '@wordpress/components';

/**
 * Heading plus stacked body, so every sidebar section is spaced the same way.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {*}      props.children
 */
const Section = ( { title, children } ) => (
	<VStack className="ypg-section" spacing={ 3 }>
		{ title && (
			<Heading
				className="ypg-section-heading"
				level={ 3 }
				size={ 13 }
				weight={ 500 }
			>
				{ title }
			</Heading>
		) }
		{ children }
	</VStack>
);

export default Section;
