// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
    // Get auth details from session storage
    const user = sessionStorage.getItem('user');
    const loginExpiration = sessionStorage.getItem('loginExpiration');

    const loginExpirationDate = new Date(loginExpiration!);

    const nowUTC = new Date();

    // Return true if user exists AND now is before loginExpiration (in UTC)
    return ((!!user) && (nowUTC <= loginExpirationDate));
};

export const isAdminUser = (): boolean => {
    // Get auth details from session storage
        const isAdmin = sessionStorage.getItem('isAdmin') === 'true' ?
            true
            : false;

        // Return true if user exists AND now is before loginExpiration (in UTC) AND user is admin
        return isAdmin;
}