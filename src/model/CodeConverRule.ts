export class Rule {
    /**
    * type： 1: 通用，2:自定义
    * match-> type: 1等于，2:包含
    * match-> target: tag, attr , content
    */
    public static RULES = [
        {
            type: 1,
            match: [{
                target: 'tag',
                type: 1,
                value: 'div'
            }, {
                target: 'attr',
                type: 1,
                key: 'bx-name',
                value: 'components/datepickerwrapper'
            }],
            convert: {
                importInfo: 'import { MuxCalendar } from \'@alife/mux-components\'',
                tag: 'MuxCalendar',
                attrMap: [
                    {
                        form: 'style',
                        to: 'style'
                    },
                    {
                        form: 'class',
                        to: 'className'
                    }
                ],
                hasContent: false
            }
        },
        {
            type: 1,
            match: [{
                target: 'tag',
                type: 1,
                value: 'select'
            }, {
                target: 'attr',
                type: 1,
                key: 'bx-name',
                value: 'components/dropdown'
            }],
            convert: {
                importInfo: 'import { MuxSelect } from \'@alife/mux-components\'',
                tag: 'MuxSelect',
                attrMap: [
                    {
                        form: 'v-model',
                        to: 'value'
                    },
                    {
                        form: 'class',
                        to: 'className'
                    },
                    {
                        form: 'style',
                        to: 'style'
                    },
                    {
                        form: 'data-width',
                        to: 'width'
                    }
                ],
                hasContent: false
            }
        },
        {
            type: 1,
            match: [{
                target: 'tag',
                type: 1,
                value: 'textarea'
            }],
            convert: {
                importInfo: 'import { MuxTextarea } from \'@alife/mux-components\'',
                tag: 'MuxTextarea',
                attrMap: [
                    {
                        form: 'v-model',
                        to: 'value'
                    },
                    {
                        form: 'class',
                        to: 'className'
                    },
                    {
                        form: 'style',
                        to: 'style'
                    },
                    {
                        form: 'placeholder',
                        to: 'placeholder'
                    }
                ],
                hasContent: true
            }
        },
        {
            type: 1,
            match: [{
                target: 'attr',
                type: 2,
                key: 'class',
                value: 'btn'
            }],
            convert: {
                importInfo: 'import { MuxButton } from \'@alife/mux-components\'',
                tag: 'MuxButton',
                attrMap: [
                    
                    {
                        form: 'class',
                        to: 'className'
                    },
                    {
                        form: 'style',
                        to: 'style'
                    }
                ],
                hasContent: true
            }
        },
        {
            type: 2,
            match: [{
                target: 'attr',
                type: 1,
                key: 'bx-name',
                value: 'components/uploader'
            }],
            convert: {
                importInfo: 'import UploaderWidget from \'components/widgets/UploaderWidget\'',
                tag: 'UploaderWidget',
                attrMap: [
                    
                    {
                        form: 'class',
                        to: 'className'
                    },
                    {
                        form: 'style',
                        to: 'style'
                    },
                    {
                        form: 'data-action',
                        to: 'action'
                    },
                    {
                        form: 'data-accept',
                        to: 'accept'
                    }
                    
                ],
                hasContent: true
            }
        }
    ]

}