/**
 * matrix.class.js
 *
 * Matrix operations in javascript.  Ported from my PHP Class as I was learning
 * some of the quirks about Javascript.  All methods of the PHP Class
 * are implemented here.
 *
 * @link http://www.phpclasses.org/package/7645-PHP-Perform-math-operations-with-matrices.html
 */
function lw_matrix(mText)
{
    
    this.matrix = Array();
    /**
     * Declare functions
     */
    this._assign = _assign;
    this.tPrint = tPrint;
    this._verify = _verify;
    this.isSquare = isSquare;
    this._getN = _getN;
    this.createIdentity = createIdentity;
    this.addMatrix = addMatrix;
    this.subMatrix = subMatrix;
    this.mpScalar = mpScalar;
    this.getDeterminant = getDeterminant;
    this.coFactor = coFactor;
    this.transpose = transpose;
    this.adjugate = adjugate;
    this.inverse = inverse;
    this.mpMatrix = mpMatrix;
    
    /**
     * Construct from input
     */
    if(mText instanceof Array) {
        this.matrix = mText;
    } else {
        this._assign(mText);
    }
    
    /*
     * Function(s) implementation
     */
    
    /**
     * Create a matrix based on string input similar to the TI Calculators
     * input string "[1,2,3;4,5,6;7,8,9]" is the equivalent of the matrix:
     * <pre>
     * | 1  2  3 |
     * | 4  5  6 |
     * | 7  8  9 |
     * </pre>
     */
    function _assign (mText) {
        mText = mText.replace("[", "").replace("]", "").replace(" ", "");
        var rows = mText.split(";");
        var i=0;
        var j=0;
        var iTop=rows.length;
        for(i=0;i<iTop;i++) {
            this.matrix[i] = Array();
            var cols = rows[i].split(",");
            var jTop = cols.length;
            for(j=0;j<jTop;j++) {
                this.matrix[i][j] = Number(cols[j]);
            }
        }
    }
    
    function tPrint(cap) {
        if(!cap) {
            cap = "M=";
        }
        var myhtml = "<table class=\"LW_Matrix_table\">\n";
        myhtml = myhtml.concat("    <caption class=\"LW_left\">"+ cap +"</caption>\n")
        var i=0;
        var j=0;
        var dPlaces = 3;
        var iTop = this.matrix.length;
        for(i=0;i<iTop;i++) {
            myhtml = myhtml.concat("    <tr class=\"LW_Matrix_row\">\n");
            var jTop = this.matrix[i].length;
            for(j=0;j<jTop;j++){
                myhtml = myhtml.concat("      <td class=\"LW_Matrix_col\">" + Number(this.matrix[i][j]).toFixed(dPlaces) + "</td>\n");
            }
            myhtml = myhtml.concat("    </tr>\n");
        }
        myhtml = myhtml.concat("</table>\n");
        return myhtml;
    }
    
    function _verify(mArray) {
        if(!mArray) {
            mArray = this.matrix;
        }
        var nSet = false;
        var iTop = mArray.length;
        var i=0; var j=0;
        for(i=0;i<iTop;i++){
            if(nSet==false) {
                nSet = mArray[i].length;
            }
            if(nSet != mArray[i].length) {
                return false;
            }
        }
        return true;
    }
    
    function isSquare(mArray) {
        if(!mArray) {
            mArray = this.matrix;
        }
        if(!this._verify(mArray)) {
            return false;
        }
        var rows = mArray.length;
        var cols = mArray[0].length;
        if(rows>1){
            return (rows==cols);
        } else {
            return false;
        }
    }
    
    function _getN(mArray) {
        if(!mArray) {
            mArray = this.matrix;
        }
        if(this.isSquare(mArray)){
            return mArray.length;
        }
        return false;
    }
    
    function createIdentity(n) {
        this.matrix = Array();
        for(i=0;i<n;i++) {
            this.matrix[i] = Array();
            for(j=0;j<n;j++) {
                if(i==j) {
                    this.matrix[i][j] = 1;
                } else {
                    this.matrix[i][j] = 0;
                }
            }
        }
    }
    
    function addMatrix(nMatrix) {
        if(!this._verify() || !nMatrix._verify()) {
            return false;
        }
        var matrix1 = this.matrix;
        var matrix2 = nMatrix.matrix;
        if((matrix1.length != matrix2.length) || (matrix1[0].length != matrix2[0].length)) {
            return false;
        }
        var i=0;var j=0;
        var rMatrix = Array();
        for(i=0;i<matrix1.length;i++) {
            rMatrix[i] = Array();
            for(j=0;j<matrix1[i].length;j++) {
                rMatrix[i][j] = matrix1[i][j] + matrix2[i][j];
            }
        }
        rMatrix = new lw_matrix(rMatrix);
        return rMatrix;
    }
    
    function subMatrix(nMatrix) {
        if(!this._verify() || !nMatrix._verify()) {
            return false;
        }
        var matrix1 = this.matrix;
        var matrix2 = nMatrix.matrix;
        if((matrix1.length != matrix2.length) || (matrix1[0].length != matrix2[0].length)) {
            return false;
        }
        var i=0; var j=0;
        var rMatrix = Array();
        for(i=0;i<matrix1.length;i++) {
            rMatrix[i] = Array();
            for(j=0;j<matrix1[i].length;j++) {
                rMatrix[i][j] = matrix1[i][j] - matrix2[i][j];
            }
        }
        rMatrix = new lw_matrix(rMatrix);
        return rMatrix;
    }
    
    function mpScalar(k) {
        if(!this._verify()) {
            return false;
        }
        var rMatrix = this.matrix;
        var rows = rMatrix.length;
        var cols = rMatrix[0].length;
        var i=0; var j=0;
        for(i=0;i<rows;i++) {
            for(j=0;j<cols;j++) {
                rMatrix[i][j] = rMatrix[i][j] * k;
            }
        }
        rMatrix = new lw_matrix(rMatrix);
        return rMatrix;
    }
    
    function getDeterminant (mArray) {
        if(!mArray) {
            mArray = this.matrix;
        }
        if(!this.isSquare(mArray)) {
            return false;
        }
        var i=0; var j=0; var j1=0; var j2=0;
        var det = 0;
        var n = this._getN(mArray);
        if(n<1) {
            return false;
        } else if (n==1) {
            det = mArray[0][0];
        } else if (n==2) {
            det = mArray[0][0]*mArray[1][1] - mArray[1][0]*mArray[0][1];
        } else {
            var nArray = Array();
            for(j1=0;j1<n;j1++) {
                for(i=1;i<n;i++) {
                    var j2=0;
                    nArray[i-1] = Array();
                    for(j=0;j<n;j++) {
                        if(j==j1) {
                            continue;
                        }
                        nArray[i-1][j2] = mArray[i][j];
                        j2++;
                    }
                }
                det += Math.pow(-1,2+j1)*mArray[0][j1]*this.getDeterminant(nArray);
            }
        }
        return det;
    }
    
    function coFactor(mArray) {
        if(!mArray) {
            mArray = this.matrix;
        }
        
        var n = this._getN(mArray);
        var minor = Array();
        var rArray = Array();
        var i1=0;
        var j1=0;
        var i=0;
        var j=0;
        for(i=0;i<n;i++) {
            rArray[i] = Array();
        }
        for(j=0;j<n;j++) {
            for(i=0;i<n;i++) {
                i1 = 0;
                var minor = Array();
                for(ion=0;ion<(n-1);ion++) {
                    minor[ion] = Array();
                }
                for(ii=0;ii<n;ii++) {
                    if(ii!=i) {
                        j1 = 0;

                        for(jj=0;jj<n;jj++) {
                            if(jj!=j) {
                                minor[i1][j1] = mArray[ii][jj];
                                j1++;
                            }
                        }
                        i1++;
                    }
                }
                var det = this.getDeterminant(minor);
                rArray[i][j] = Math.pow(-1,i+j+2)*det;
            }
        }
        return rArray;
    }
    
    function transpose (mArray) {
        if(!mArray) {
            mArray = this.matrix;
        }
        if(!this.isSquare(mArray)) {
            return false;
        }
        var i=0;var j=0;
        var n = this._getN(mArray);
        var rArray = Array();
        for(i=0;i<n;i++) {
            rArray[i] = Array();
            for(j=0;j<n;j++) {
                rArray[i][j] = mArray[j][i];
            }
        }
        return rArray;
    }
    
    function adjugate(mArray) {
        if(!mArray) {
            mArray = this.matrix;
        }
        var rArray = this.transpose(this.coFactor(mArray));
        return rArray;
    }
    
    function inverse(mArray) {
        if(!mArray) {
            mArray = this.matrix;
        }
        
        var det = this.getDeterminant(mArray);
        if(det == 0) {
            return false;
        }
        
        var scalar = 1/det;
        var adj = new lw_matrix(this.adjugate(mArray));
        var iMatrix = adj.mpScalar(scalar);
        return iMatrix;
    }
    
    function mpMatrix(nMatrix) {
        if(!nMatrix._verify() || !this._verify()) {
            return false;
        }
        var matrix1 = this.matrix;
        var matrix2 = nMatrix.matrix;
        if(matrix1[0].length != matrix2.length) {
            return false;
        }
        var rArray = Array();
        var bRows = matrix2[0].length;
        var i = 0; var j = 0; var k = 0;
        for(i=0;i<matrix1.length;i++) {
            rArray[i] = Array();
            for(j=0;j<matrix2[0].length;j++) {
                var value = 0;
                for(k=0;k<matrix2.length;k++) {
                    value += matrix1[i][k] * matrix2[k][j];
                }
                rArray[i][j] = value;
            }
        }
        rMatrix = new lw_matrix(rArray);
        return rMatrix;
    }
}