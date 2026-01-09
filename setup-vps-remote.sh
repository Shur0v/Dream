#!/usr/bin/expect -f

# VPS Setup Script using Expect
# This will automatically connect and run setup

set timeout 300
set host "72.60.205.98"
set user "root"
set pass "fzD#zxCsjU6pUSB"

spawn ssh -o StrictHostKeyChecking=no $user@$host

expect {
    "password:" {
        send "$pass\r"
        exp_continue
    }
    "yes/no" {
        send "yes\r"
        exp_continue
    }
    "# " {
        send "cd /var/www/dreamshop\r"
        expect "# "
        send "pwd\r"
        expect "# "
        send "ls -la\r"
        expect "# "
        send "echo 'Starting setup...'\r"
        expect "# "
        send "npm --version\r"
        expect "# "
        send "node --version\r"
        expect "# "
        send "pm2 --version\r"
        expect "# "
        send "exit\r"
    }
}

interact

