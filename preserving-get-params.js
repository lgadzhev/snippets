/**
 * Preserving all GET params through all pages
 */
function preserveGetParams() {
	var whitelistedGETParams = [];
	var currentHost = window.location.hostname;
	var currentGETParams = window.location.search;

	if ( currentGETParams === '' ) {
		return;
	}

	$( document ).on( 'click', 'a', function( event ) {
		try {
			var $this = $( this );
			if ( $this.attr( 'href' ) && $this.attr( 'href' ).indexOf( currentHost ) !== - 1 ) {

				var getParamsForTag = $this.attr( 'href' ).split( '?' ).filter( function( urlPart ) {
					return urlPart !== '';
				} );

				if ( getParamsForTag.length > 1 ) {
					getParamsForTag = getParamsForTag[1];
				} else {
					getParamsForTag = '';
				}

				event.preventDefault();
				window.location = $this.attr( 'href' ) + getAllUTMParamsOnly( currentGETParams, getParamsForTag );
			}
		} catch ( error ) {
			console.error( error );
		}
	} );

	// utm_source=instagram-jf || cpc && utm_medium=cpc
	// Consider that we have GTM and there are scripts that are also transfering GET params Example: the ?azo param
	function getAllUTMParamsOnly( getParam, getParamsForTag ) {
		try {
			var utmRegex = /utm_source=taboola$|utm_medium=cpc$/;
			var allGetParams = getParam.split( /\?|&/ ).filter( function( getParamPair ) {
				return getParamPair !== '' && (
					utmRegex.test( getParamPair ) || whitelistedGETParams.indexOf( getParamPair ) !== - 1
				);
			} );

			if ( allGetParams.length === 0 ) {
				return '';
			}

			allGetParams = allGetParams.join( '&' );
			if ( getParamsForTag === '' ) {
				allGetParams = '?' + allGetParams;
			} else {
				allGetParams = '&' + allGetParams;
			}


			if ( (
				     allGetParams.indexOf( 'utm_medium' ) !== - 1 && allGetParams.indexOf( 'utm_source' ) !== - 1
			     ) || checkInArray( whitelistedGETParams, allGetParams ) ) {
				return allGetParams;
			} else {
				return '';
			}

		} catch ( error ) {
			console.log( error );
			return '';
		}
	}

	function checkInArray( array, string ) {
		array = array.filter( function( arrayElement ) {
			return arrayElement.indexOf( string ) !== - 1 || string.indexOf( arrayElement ) !== - 1;
		} );
		return array.length > 0;
	}
}
