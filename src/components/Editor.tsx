import { BlockNoteView } from "@blocknote/mantine";
import {
    useCreateBlockNote,
    DragHandleButton,
    SideMenu,
    SideMenuController,
    useComponentsContext,
    useBlockNoteEditor,
    SideMenuProps,
} from "@blocknote/react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import React, { forwardRef, useImperativeHandle, useRef } from "react";

const Editor = forwardRef<{ focus: () => void }, {
    setFocusedComponent: (component: 'player' | 'editor' | null) => void
}>
    ((props, ref) => {
        const editor = useCreateBlockNote();
        const editorRef = useRef<HTMLDivElement>(null);
        const regex = '(?<=[.!?]) +';

        useImperativeHandle(ref, () => ({
            focus: () => {
                const focusNextElement = () => {
                    // Get all focusable elements
                    const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
                    const elements = Array.from(document.querySelectorAll(focusable));
                    
                    // Find current element index
                    const currentIndex = elements.indexOf(editorRef.current as Element);
                    
                    // Focus next element or first if at end
                    const nextElement = elements[currentIndex + 1] || elements[0];
                    (nextElement as HTMLElement).focus();
                };

                editorRef.current?.focus();
                focusNextElement();
            },
        }), []);

        return (
            <div
                ref={editorRef}
                tabIndex={0}
                className="flex flex-col mx-0.5 h-full bg-gray-900 rounded-lg p-2 overflow-auto"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
                onFocus={() => props.setFocusedComponent('editor')}
            >
                <BlockNoteView slashMenu={false} editor={editor} sideMenu={false} data-theming-css-demo>
                    <SideMenuController
                        sideMenu={(props) => (
                            <SideMenu {...props}>
                                <DuplicateBlockButton {...props} />
                                <DragHandleButton {...props} />
                            </SideMenu>
                        )}
                    />
                </BlockNoteView>
            </div>
        );
    });

function DuplicateBlockButton(props: SideMenuProps) {
    const editor = useBlockNoteEditor();

    const Components = useComponentsContext()!;

    return (
        <Components.SideMenu.Button
            label="Duplicate block"
            icon={
                <ContentCopyIcon
                    onClick={() => {
                        const duplicatedBlock = editor.getBlock(props.block.id);
                        if (duplicatedBlock) {
                            editor.insertBlocks([duplicatedBlock], props.block, 'after');
                        }
                    }}
                />
            }
        />
    );
}

export default Editor;
