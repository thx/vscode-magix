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
        },
        {
            type: 2,
            match: [{
                target: 'tag',
                type: 1,
                value: 'input'
            },{
                target: 'attr',
                type: 1,
                key: 'type',
                value: 'text'
            }],
            convert: {
                importInfo: 'import { MuxInput } from \'@alife/mux-components\'',
                tag: 'MuxInput',
                attrMap: [
                    {
                        form: 'v-model',
                        to: 'value'
                    },
                    {
                        form: 'placeholder',
                        to: 'placeholder'
                    }
                ],
                hasContent: false
            }
        },
        {
            type: 2,
            match: [{
                target: 'tag',
                type: 1,
                value: 'input'
            },{
                target: 'attr',
                type: 1,
                key: 'type',
                value: 'radio'
            }],
            convert: {
                importInfo: 'import { MuxRadio } from \'@alife/mux-components\'',
                tag: 'MuxRadio',
                attrMap: [
                    {
                        form: 'v-model',
                        to: 'value'
                    }
                ],
                hasContent: false
            }
        }
    ]

}