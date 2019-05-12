const pagination = require('pagination');

const translations = {
    'PREVIOUS' : '<<',
    'NEXT' : '>>',
    'FIRST' : 'Первая',
    'LAST' : 'Последняя',
    'CURRENT_PAGE_REPORT' : 'Resulten {FromResult} - {ToResult} van {TotalResult}'
};

const create = (prelink, current, rowsPerPage, totalResult, slashSeparator = false) => {
    return new pagination.TemplatePaginator({
        prelink: prelink,
        current: current,
        rowsPerPage: rowsPerPage,
        totalResult: totalResult,
        slashSeparator: slashSeparator,
        translator : function(str) {
            return translations[str];
        },
        template: function (result) {
            let i, len, prelink;
            let html = '<div class="float-right"><ul class="pagination">';

            if (result.pageCount < 2) {
                html += '</ul></div>';
                return html;
            }

            prelink = this.preparePreLink(result.prelink);

            if (result.first) {
                html += '<li class="page-item"><a class="page-link" href="' + prelink + result.first + '">' + this.options.translator('FIRST') + '</a></li>';
            }

            if (result.previous) {
                html += '<li class="page-item"><a class="page-link" href="' + prelink + result.previous + '">' + this.options.translator('PREVIOUS') + '</a></li>';
            }

            if (result.range.length) {
                for (i = 0, len = result.range.length; i < len; i++) {
                    if (result.range[i] === result.current) {
                        html += '<li class="active page-item"><a class="page-link" href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
                    } else {
                        html += '<li class="page-item"><a class="page-link" href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
                    }
                }
            }

            if (result.next) {
                html += '<li class="page-item"><a class="page-link" href="' + prelink + result.next + '" class="paginator-next">' + this.options.translator('NEXT') + '</a></li>';
            }

            if (result.last) {
                html += '<li class="page-item"><a class="page-link" href="' + prelink + result.last + '" class="paginator-next">' + this.options.translator('LAST') + '</a></li>';
            }

            html += '</ul></div>';

            return html;
        }
    });
};

module.exports.create = create;