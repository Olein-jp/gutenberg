/**
 * WordPress dependencies
 */

import { Toolbar } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	applyLineFormat,
	removeLineFormat,
} from '@wordpress/rich-text';

/**
 * Internal dependencies
 */

import { RichTextShortcut } from './shortcut';
import BlockFormatControls from '../block-format-controls';

function isListRootSelected( editor ) {
	return (
		! editor.selection ||
		editor.selection.getNode().closest( 'ol,ul' ) === editor.getBody()
	);
}

function isActiveListType( editor, tagName, rootTagName ) {
	if ( document.activeElement !== editor.getBody() ) {
		return tagName === rootTagName;
	}

	const listItem = editor.selection.getNode();
	const list = listItem.closest( 'ol,ul' );

	if ( ! list ) {
		return;
	}

	return list.nodeName.toLowerCase() === tagName;
}

export const ListEdit = ( {
	editor,
	onTagNameChange,
	tagName,
	onSyncDOM,
	value,
	onChange,
} ) => (
	<Fragment>
		<RichTextShortcut
			type="primary"
			character="["
			onUse={ () => {
				onChange( removeLineFormat( value ) );
			} }
		/>
		<RichTextShortcut
			type="primary"
			character="]"
			onUse={ () => {
				onChange( applyLineFormat( value, { type: tagName } ) );
			} }
		/>
		<RichTextShortcut
			type="primary"
			character="m"
			onUse={ () => {
				onChange( applyLineFormat( value, { type: tagName } ) );
			} }
		/>
		<RichTextShortcut
			type="primaryShift"
			character="m"
			onUse={ () => {
				onChange( removeLineFormat( value ) );
			} }
		/>
		<BlockFormatControls>
			<Toolbar
				controls={ [
					{
						icon: 'editor-ul',
						title: __( 'Convert to unordered list' ),
						isActive: isActiveListType( editor, 'ul', tagName ),
						onClick() {
							if ( isListRootSelected( editor ) ) {
								onTagNameChange( 'ul' );
							} else {
								editor.execCommand( 'InsertUnorderedList' );
								onSyncDOM();
							}
						},
					},
					{
						icon: 'editor-ol',
						title: __( 'Convert to ordered list' ),
						isActive: isActiveListType( editor, 'ol', tagName ),
						onClick() {
							if ( isListRootSelected( editor ) ) {
								onTagNameChange( 'ol' );
							} else {
								editor.execCommand( 'InsertOrderedList' );
								onSyncDOM();
							}
						},
					},
					{
						icon: 'editor-outdent',
						title: __( 'Outdent list item' ),
						onClick: () => {
							onChange( removeLineFormat( value ) );
						},
					},
					{
						icon: 'editor-indent',
						title: __( 'Indent list item' ),
						onClick: () => {
							onChange( applyLineFormat( value, { type: tagName } ) );
						},
					},
				] }
			/>
		</BlockFormatControls>
	</Fragment>
);
