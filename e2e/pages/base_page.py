from e2e import config


class BasePage:
    @property
    def field_error(self):
        return self.page.get_by_role("alert")

    def go_to_registration_page(self):
        self.page.get_by_role("link", name="Register").click()

    def go_to_home_page(self):
        self.page.get_by_role("link", name="Home").click()

    def go_to_account_page(self):
        self.page.get_by_test_id("account-link").click()

    @property
    def unauthorised(self):
        return self.page.get_by_text("you need an account")

    @property
    def header(self):
        return self.page.get_by_role("banner")

    @property
    def sign_in_button(self):
        return self.header.get_by_role("button", name="Sign in")

    @property
    def sign_out_button(self):
        return self.header.get_by_role("button", name="Sign out")

    @property
    def register_button(self):
        return self.header.get_by_role("button", name="Register")

    @property
    def username_input(self):
        return self.header.get_by_role("textbox", name="Username")

    @property
    def email_input(self):
        return self.header.get_by_role("textbox", name="Email")

    @property
    def password_input(self):
        return self.header.get_by_role("textbox", name="Password")

    def sign_in(self, username=config.USERNAME, password=config.PASSWORD):
        self.username_input.fill(username)
        self.password_input.fill(password)
        self.sign_in_button.click()

        return username

    def sign_out(self):
        self.sign_out_button.click()
