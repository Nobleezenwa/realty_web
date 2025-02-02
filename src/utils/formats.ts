const numberFormat = new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 2 });

export const parseNumber = (stringNumber: string | number)=>{
    if (typeof stringNumber !== 'number' && typeof stringNumber !== 'string') return 0;
    stringNumber = (typeof stringNumber === 'string')? stringNumber : stringNumber.toString();   
    var thousandSeparator = numberFormat.format(11111).replace(/\p{Number}/gu, '');
    var decimalSeparator = numberFormat.format(1.1).replace(/\p{Number}/gu, '');
    let result = parseFloat(
                  stringNumber 
                  .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
                  .replace(new RegExp('\\' + decimalSeparator), '.')
                );
    if (isNaN(result)) { return 0; }
    return result;
};

export const formatNumber = (num: any)=>{
    if (isNaN(num)) {
      num = parseNumber(num);
      if (isNaN(num)) { num = 0; }
    }
    return numberFormat.format(num);
};

