const H = "data:text/javascript;base64,dmFyIGF0PU9iamVjdC5kZWZpbmVQcm9wZXJ0eTt2YXIgaHQ9KHUsbSxmKT0+bSBpbiB1P2F0KHUsbSx7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Zn0pOnVbbV09Zjt2YXIgZT0odSxtLGYpPT5odCh1LHR5cGVvZiBtIT0ic3ltYm9sIj9tKyIiOm0sZik7KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2NvbnN0IHU9dHlwZW9mIHNhbXBsZVJhdGU8InUiP3NhbXBsZVJhdGU6NDhlMyxtPU1hdGguUEkvdSxmPTEvdTtsZXQgVj1oPT5NYXRoLnBvdyhoLDIpO2Z1bmN0aW9uIF8oaCl7cmV0dXJuIFYoaCl9ZnVuY3Rpb24gTyhoLHMsdCl7Y29uc3QgaT1NYXRoLnNpbigoMS10KSouNSpNYXRoLlBJKSxuPU1hdGguc2luKHQqLjUqTWF0aC5QSSk7cmV0dXJuIGgqaStzKm59Y2xhc3MgZ3tjb25zdHJ1Y3Rvcigpe2UodGhpcywicGhhc2UiLDApfXVwZGF0ZShzKXtjb25zdCB0PU1hdGguc2luKHRoaXMucGhhc2UqMipNYXRoLlBJKTtyZXR1cm4gdGhpcy5waGFzZT0odGhpcy5waGFzZStzL3UpJTEsdH19Y2xhc3MgSXtjb25zdHJ1Y3Rvcigpe2UodGhpcywicGhhc2UiLDApfXVwZGF0ZShzKXtyZXR1cm4gdGhpcy5waGFzZSs9ZipzLHRoaXMucGhhc2UlMSoyLTF9fWZ1bmN0aW9uIE0oaCxzKXtyZXR1cm4gaDxzPyhoLz1zLGgraC1oKmgtMSk6aD4xLXM/KGg9KGgtMSkvcyxoKmgraCtoKzEpOjB9Y2xhc3MgU3tjb25zdHJ1Y3RvcihzPXt9KXt0aGlzLnBoYXNlPXMucGhhc2U/PzB9dXBkYXRlKHMpe2NvbnN0IHQ9cy91O2xldCBpPU0odGhpcy5waGFzZSx0KSxuPTIqdGhpcy5waGFzZS0xLWk7cmV0dXJuIHRoaXMucGhhc2UrPXQsdGhpcy5waGFzZT4xJiYodGhpcy5waGFzZS09MSksbn19ZnVuY3Rpb24gVChoLHMsdCl7cmV0dXJuIGg8Mj8wOigobixsLHIpPT5yKihsLW4pK24pKC1zKi41LHMqLjUsdC8oaC0xKSl9ZnVuY3Rpb24geihoLHMpe3JldHVybiBoKk1hdGgucG93KDIscy8xMil9Y2xhc3MgRntjb25zdHJ1Y3RvcihzPXt9KXt0aGlzLnZvaWNlcz1zLnZvaWNlcz8/NSx0aGlzLmZyZXFzcHJlYWQ9cy5mcmVxc3ByZWFkPz8uMix0aGlzLnBhbnNwcmVhZD1zLnBhbnNwcmVhZD8/LjQsdGhpcy5waGFzZT1uZXcgRmxvYXQzMkFycmF5KHRoaXMudm9pY2VzKS5tYXAoKCk9Pk1hdGgucmFuZG9tKCkpfXVwZGF0ZShzKXtjb25zdCB0PU1hdGguc3FydCgxLXRoaXMucGFuc3ByZWFkKSxpPU1hdGguc3FydCh0aGlzLnBhbnNwcmVhZCk7bGV0IG49MCxsPTA7Zm9yKGxldCByPTA7cjx0aGlzLnZvaWNlcztyKyspe2NvbnN0IGE9eihzLFQodGhpcy52b2ljZXMsdGhpcy5mcmVxc3ByZWFkLHIpKS91LGM9KHImMSk9PTE7bGV0IGQ9dDtjJiYoZD1pKTtsZXQgYj1NKHRoaXMucGhhc2Vbcl0sYSksRT0yKnRoaXMucGhhc2Vbcl0tMS1iO249bitFKmQsbD1sK0UqZCx0aGlzLnBoYXNlW3JdKz1hLHRoaXMucGhhc2Vbcl0+MSYmKHRoaXMucGhhc2Vbcl0tPTEpfXJldHVybiBuK2x9fWNsYXNzIGt7Y29uc3RydWN0b3IoKXtlKHRoaXMsInBoYXNlIiwwKX11cGRhdGUocyl7dGhpcy5waGFzZSs9ZipzO2xldCB0PXRoaXMucGhhc2UlMTtyZXR1cm4odDwuNT8yKnQ6MS0yKih0LS41KSkqMi0xfX1jbGFzcyBxe2NvbnN0cnVjdG9yKCl7ZSh0aGlzLCJzMCIsMCk7ZSh0aGlzLCJzMSIsMCl9dXBkYXRlKHMsdCxpPTApe2k9TWF0aC5tYXgoaSwwKSx0PU1hdGgubWluKHQsMmU0KTtjb25zdCBuPTIqTWF0aC5zaW4odCptKSxyPTEtTWF0aC5wb3coLjUsKGkrLjEyNSkvLjEyNSkqbjtyZXR1cm4gdGhpcy5zMD1yKnRoaXMuczAtbip0aGlzLnMxK24qcyx0aGlzLnMxPXIqdGhpcy5zMStuKnRoaXMuczAsdGhpcy5zMX19Y2xhc3MgQ3tjb25zdHJ1Y3RvcihzPTApe3RoaXMucGhhc2U9c31zYXcocyx0KXtsZXQgaT0odGhpcy5waGFzZStzKSUxLG49TShpLHQpO3JldHVybiAyKmktMS1ufXVwZGF0ZShzLHQ9LjUpe2NvbnN0IGk9cy91O2xldCBuPXRoaXMuc2F3KDAsaSktdGhpcy5zYXcodCxpKTtyZXR1cm4gdGhpcy5waGFzZT0odGhpcy5waGFzZStpKSUxLG4rdCoyLTF9fWNsYXNzIEx7Y29uc3RydWN0b3IoKXtlKHRoaXMsInBoYXNlIiwwKX11cGRhdGUocyx0PS41KXtyZXR1cm4gdGhpcy5waGFzZSs9ZipzLHRoaXMucGhhc2UlMTx0PzE6LTF9fWNsYXNzIFB7Y29uc3RydWN0b3IoKXtlKHRoaXMsInVwZGF0ZSIscz0+TWF0aC5yYW5kb20oKTxzKmY/TWF0aC5yYW5kb20oKTowKX19Y2xhc3MgTnt1cGRhdGUoKXtyZXR1cm4gTWF0aC5yYW5kb20oKSoyLTF9fWNsYXNzIEd7Y29uc3RydWN0b3IoKXt0aGlzLm91dD0wfXVwZGF0ZSgpe2xldCBzPU1hdGgucmFuZG9tKCkqMi0xO3JldHVybiB0aGlzLm91dD0odGhpcy5vdXQrLjAyKnMpLzEuMDIsdGhpcy5vdXR9fWNsYXNzIGp7Y29uc3RydWN0b3IoKXt0aGlzLmIwPTAsdGhpcy5iMT0wLHRoaXMuYjI9MCx0aGlzLmIzPTAsdGhpcy5iND0wLHRoaXMuYjU9MCx0aGlzLmI2PTB9dXBkYXRlKCl7Y29uc3Qgcz1NYXRoLnJhbmRvbSgpKjItMTt0aGlzLmIwPS45OTg4Nip0aGlzLmIwK3MqLjA1NTUxNzksdGhpcy5iMT0uOTkzMzIqdGhpcy5iMStzKi4wNzUwNzU5LHRoaXMuYjI9Ljk2OSp0aGlzLmIyK3MqLjE1Mzg1Mix0aGlzLmIzPS44NjY1KnRoaXMuYjMrcyouMzEwNDg1Nix0aGlzLmI0PS41NSp0aGlzLmI0K3MqLjUzMjk1MjIsdGhpcy5iNT0tLjc2MTYqdGhpcy5iNS1zKi4wMTY4OTg7Y29uc3QgdD10aGlzLmIwK3RoaXMuYjErdGhpcy5iMit0aGlzLmIzK3RoaXMuYjQrdGhpcy5iNSt0aGlzLmI2K3MqLjUzNjI7cmV0dXJuIHRoaXMuYjY9cyouMTE1OTI2LHQqLjExfX1jbGFzcyBCe2NvbnN0cnVjdG9yKCl7ZSh0aGlzLCJwaGFzZSIsMSl9dXBkYXRlKHMpe3RoaXMucGhhc2UrPWYqcztsZXQgdD10aGlzLnBoYXNlPj0xPzE6MDtyZXR1cm4gdGhpcy5waGFzZT10aGlzLnBoYXNlJTEsdH19ZnVuY3Rpb24gUihoLHMsdCxpPTEpe2lmKGg8PTApcmV0dXJuIHM7aWYoaD49MSlyZXR1cm4gdDtsZXQgbjtyZXR1cm4gaT09PTA/bj1oOmk+MD9uPU1hdGgucG93KGgsaSk6bj0xLU1hdGgucG93KDEtaCwtaSkscysodC1zKSpufWNsYXNzIHZ7Y29uc3RydWN0b3Iocz17fSl7dGhpcy5zdGF0ZT0ib2ZmIix0aGlzLnN0YXJ0VGltZT0wLHRoaXMuc3RhcnRWYWw9MCx0aGlzLmRlY2F5Q3VydmU9cy5kZWNheUN1cnZlPz8xfXVwZGF0ZShzLHQsaSxuLGwscil7c3dpdGNoKHRoaXMuc3RhdGUpe2Nhc2Uib2ZmIjpyZXR1cm4gdD4wJiYodGhpcy5zdGF0ZT0iYXR0YWNrIix0aGlzLnN0YXJ0VGltZT1zLHRoaXMuc3RhcnRWYWw9MCksMDtjYXNlImF0dGFjayI6e2xldCBwPXMtdGhpcy5zdGFydFRpbWU7cmV0dXJuIHA+aT8odGhpcy5zdGF0ZT0iZGVjYXkiLHRoaXMuc3RhcnRUaW1lPXMsMSk6UihwL2ksdGhpcy5zdGFydFZhbCwxLDEpfWNhc2UiZGVjYXkiOntsZXQgcD1zLXRoaXMuc3RhcnRUaW1lLGE9UihwL24sMSxsLC10aGlzLmRlY2F5Q3VydmUpO3JldHVybiB0PD0wPyh0aGlzLnN0YXRlPSJyZWxlYXNlIix0aGlzLnN0YXJ0VGltZT1zLHRoaXMuc3RhcnRWYWw9YSxhKTpwPm4/KHRoaXMuc3RhdGU9InN1c3RhaW4iLHRoaXMuc3RhcnRUaW1lPXMsbCk6YX1jYXNlInN1c3RhaW4iOnJldHVybiB0PD0wJiYodGhpcy5zdGF0ZT0icmVsZWFzZSIsdGhpcy5zdGFydFRpbWU9cyx0aGlzLnN0YXJ0VmFsPWwpLGw7Y2FzZSJyZWxlYXNlIjp7bGV0IHA9cy10aGlzLnN0YXJ0VGltZTtpZihwPnIpcmV0dXJuIHRoaXMuc3RhdGU9Im9mZiIsMDtsZXQgYT1SKHAvcix0aGlzLnN0YXJ0VmFsLDAsLXRoaXMuZGVjYXlDdXJ2ZSk7cmV0dXJuIHQ+MCYmKHRoaXMuc3RhdGU9ImF0dGFjayIsdGhpcy5zdGFydFRpbWU9cyx0aGlzLnN0YXJ0VmFsPWEpLGF9fXRocm93ImludmFsaWQgZW52ZWxvcGUgc3RhdGUifX1jb25zdCBXPTEwO2NsYXNzIHh7Y29uc3RydWN0b3IoKXtlKHRoaXMsIndyaXRlSWR4IiwwKTtlKHRoaXMsInJlYWRJZHgiLDApO2UodGhpcywiYnVmZmVyIixuZXcgRmxvYXQzMkFycmF5KFcqdSkpfXdyaXRlKHMsdCl7dGhpcy53cml0ZUlkeD0odGhpcy53cml0ZUlkeCsxKSV0aGlzLmJ1ZmZlci5sZW5ndGgsdGhpcy5idWZmZXJbdGhpcy53cml0ZUlkeF09cztsZXQgaT1NYXRoLm1pbihNYXRoLmZsb29yKHUqdCksdGhpcy5idWZmZXIubGVuZ3RoLTEpO3RoaXMucmVhZElkeD10aGlzLndyaXRlSWR4LWksdGhpcy5yZWFkSWR4PDAmJih0aGlzLnJlYWRJZHgrPXRoaXMuYnVmZmVyLmxlbmd0aCl9dXBkYXRlKHMsdCl7cmV0dXJuIHRoaXMud3JpdGUocyx0KSx0aGlzLmJ1ZmZlclt0aGlzLnJlYWRJZHhdfX1jbGFzcyBYe2NvbnN0cnVjdG9yKCl7ZSh0aGlzLCJkZWxheSIsbmV3IHgpO2UodGhpcywibW9kdWxhdG9yIixuZXcgayl9dXBkYXRlKHMsdCxpLG4sbCl7Y29uc3Qgcj10aGlzLm1vZHVsYXRvci51cGRhdGUobikqbCxwPXRoaXMuZGVsYXkudXBkYXRlKHMsaSooMStyKSk7cmV0dXJuIE8ocyxwLHQpfX1jbGFzcyAke2NvbnN0cnVjdG9yKCl7ZSh0aGlzLCJob2xkIiwwKTtlKHRoaXMsInQiLDApfXVwZGF0ZShzLHQpe3JldHVybiB0aGlzLnQrKyV0PT09MCYmKHRoaXMudD0wLHRoaXMuaG9sZD1zKSx0aGlzLmhvbGR9fWNsYXNzIFV7dXBkYXRlKHMsdCl7dD1NYXRoLm1heCgxLHQpO2NvbnN0IGk9TWF0aC5wb3coMix0LTEpO3JldHVybiBNYXRoLnJvdW5kKHMqaSkvaX19Y2xhc3MgWXt1cGRhdGUocyx0PTAsaT0xKXtpPU1hdGgubWF4KC4wMDEsTWF0aC5taW4oMSxpKSk7Y29uc3Qgbj1NYXRoLmV4cG0xKHQpO3JldHVybigxK24pKnMvKDErbipNYXRoLmFicyhzKSkqaX19Y2xhc3Mgd3tjb25zdHJ1Y3RvcihzLHQsaSl7ZSh0aGlzLCJidWZmZXIiKTtlKHRoaXMsInNhbXBsZVJhdGUiKTtlKHRoaXMsInBvcyIsMCk7ZSh0aGlzLCJzYW1wbGVGcmVxIixBKCkpO3RoaXMuYnVmZmVyPXMsdGhpcy5zYW1wbGVSYXRlPXQsdGhpcy5kdXJhdGlvbj10aGlzLmJ1ZmZlci5sZW5ndGgvdGhpcy5zYW1wbGVSYXRlLHRoaXMuc3BlZWQ9dS90aGlzLnNhbXBsZVJhdGUsaSYmKHRoaXMuc3BlZWQqPXRoaXMuZHVyYXRpb24pfXVwZGF0ZShzKXtpZih0aGlzLnBvcz49dGhpcy5idWZmZXIubGVuZ3RoKXJldHVybiAwO2NvbnN0IHQ9cy90aGlzLnNhbXBsZUZyZXEqdGhpcy5zcGVlZDtsZXQgaT10aGlzLmJ1ZmZlcltNYXRoLmZsb29yKHRoaXMucG9zKV07cmV0dXJuIHRoaXMucG9zPXRoaXMucG9zK3QsaX19ZSh3LCJzYW1wbGVzIixuZXcgTWFwKTtjb25zdCB5PShoLHM9ImxpbmVhciIsdCk9Pntjb25zdFtyLHAsYSxjXT1oO2lmKHI9PW51bGwmJnA9PW51bGwmJmE9PW51bGwmJmM9PW51bGwpcmV0dXJuIHQ/P1suMDAxLC4wMDEsMSwuMDFdO2NvbnN0IGQ9YT8/KHIhPW51bGwmJnA9PW51bGx8fHI9PW51bGwmJnA9PW51bGw/MTouMDAxKTtyZXR1cm5bTWF0aC5tYXgocj8/MCwuMDAxKSxNYXRoLm1heChwPz8wLC4wMDEpLE1hdGgubWluKGQsMSksTWF0aC5tYXgoYz8/MCwuMDEpXX07bGV0IEQ9e3NpbmU6ZyxzYXc6Uyx6YXc6SSxzYXd0b290aDpTLHphd3Rvb3RoOkksc3VwZXJzYXc6Rix0cmk6ayx0cmlhbmdsZTprLHB1bHNlOkMsc3F1YXJlOkMscHVsemU6TCxkdXN0OlAsY3JhY2tsZTpQLGltcHVsc2U6Qix3aGl0ZTpOLGJyb3duOkcscGluazpqfTtjb25zdCBaPXtjaG9ydXM6MCxub3RlOjQ4LHM6InRyaWFuZ2xlIixiYW5rOiIiLGdhaW46MSxwb3N0Z2FpbjoxLHZlbG9jaXR5OjEsZGVuc2l0eToiLjAzIixmdHlwZToiMTJkYiIsZmFuY2hvcjowLHJlc29uYW5jZTowLGhyZXNvbmFuY2U6MCxiYW5kcTowLGNoYW5uZWxzOlsxLDJdLHBoYXNlcmRlcHRoOi43NSxzaGFwZXZvbDoxLGRpc3RvcnR2b2w6MSxkZWxheTowLGJ5dGVCZWF0RXhwcmVzc2lvbjoiMCIsZGVsYXlmZWVkYmFjazouNSxkZWxheXNwZWVkOjEsZGVsYXl0aW1lOi4yNSxvcmJpdDoxLGk6MSxmZnQ6OCx6OiJ0cmlhbmdsZSIscGFuOi41LGZtaDoxLGZtZW52OjAsc3BlZWQ6MSxwdzouNX07bGV0IG89aD0+WltoXTtjb25zdCBIPXtjOjAsZDoyLGU6NCxmOjUsZzo3LGE6OSxiOjExfSxKPXsiIyI6MSxiOi0xLHM6MSxmOi0xfSxLPShoLHM9Myk9Pnt2YXIgYTtsZXRbdCxpPSIiLG49IiJdPSgoYT1TdHJpbmcoaCkubWF0Y2goL14oW2EtZ0EtR10pKFsjYnNmXSopKFswLTldKikkLykpPT1udWxsP3ZvaWQgMDphLnNsaWNlKDEpKXx8W107aWYoIXQpdGhyb3cgbmV3IEVycm9yKCdub3QgYSBub3RlOiAiJytoKyciJyk7Y29uc3QgbD1IW3QudG9Mb3dlckNhc2UoKV0scj0oaT09bnVsbD92b2lkIDA6aS5zcGxpdCgiIikucmVkdWNlKChjLGQpPT5jK0pbZF0sMCkpfHwwO3JldHVybihOdW1iZXIobnx8cykrMSkqMTIrbCtyfSxRPWg9Pk1hdGgucG93KDIsKGgtNjkpLzEyKSo0NDAsQT1oPT4oaD1ofHxvKCJub3RlIiksdHlwZW9mIGg9PSJzdHJpbmciJiYoaD1LKGgsMykpLFEoaCkpO2NsYXNzIHR0e2NvbnN0cnVjdG9yKHMpe2UodGhpcywiaWQiLDApO2UodGhpcywib3V0IixbMCwwXSk7ZSh0aGlzLCJhdHRhY2siKTtlKHRoaXMsImRlY2F5Iik7ZSh0aGlzLCJzdXN0YWluIik7ZSh0aGlzLCJyZWxlYXNlIik7ZSh0aGlzLCJfYmVnaW4iKTtlKHRoaXMsIl9kdXJhdGlvbiIpO2UodGhpcywiX3NvdW5kIik7ZSh0aGlzLCJfY2hhbm5lbHMiLDEpO2UodGhpcywiX2J1ZmZlcnMiKTtlKHRoaXMsInVuaXQiKTtlKHRoaXMsIl9wZW52Iik7ZSh0aGlzLCJwZW52Iik7ZSh0aGlzLCJwYXR0YWNrIik7ZSh0aGlzLCJwZGVjYXkiKTtlKHRoaXMsInBzdXN0YWluIik7ZSh0aGlzLCJwcmVsZWFzZSIpO2UodGhpcywidmliIik7ZSh0aGlzLCJfdmliIik7ZSh0aGlzLCJ2aWJtb2QiKTtlKHRoaXMsIl9mbSIpO2UodGhpcywiZm1oIik7ZSh0aGlzLCJmbWkiKTtlKHRoaXMsIl9mbWVudiIpO2UodGhpcywiZm1hdHRhY2siKTtlKHRoaXMsImZtZGVjYXkiKTtlKHRoaXMsImZtc3VzdGFpbiIpO2UodGhpcywiZm1yZWxlYXNlIik7ZSh0aGlzLCJfbHBlbnYiKTtlKHRoaXMsImxwZW52Iik7ZSh0aGlzLCJscGF0dGFjayIpO2UodGhpcywibHBkZWNheSIpO2UodGhpcywibHBzdXN0YWluIik7ZSh0aGlzLCJscHJlbGVhc2UiKTtlKHRoaXMsIl9ocGVudiIpO2UodGhpcywiaHBlbnYiKTtlKHRoaXMsImhwYXR0YWNrIik7ZSh0aGlzLCJocGRlY2F5Iik7ZSh0aGlzLCJocHN1c3RhaW4iKTtlKHRoaXMsImhwcmVsZWFzZSIpO2UodGhpcywiX2JwZW52Iik7ZSh0aGlzLCJicGVudiIpO2UodGhpcywiYnBhdHRhY2siKTtlKHRoaXMsImJwZGVjYXkiKTtlKHRoaXMsImJwc3VzdGFpbiIpO2UodGhpcywiYnByZWxlYXNlIik7ZSh0aGlzLCJjdXRvZmYiKTtlKHRoaXMsImhjdXRvZmYiKTtlKHRoaXMsImJhbmRmIik7ZSh0aGlzLCJjb2Fyc2UiKTtlKHRoaXMsImNydXNoIik7ZSh0aGlzLCJkaXN0b3J0Iik7ZSh0aGlzLCJmcmVxIik7ZSh0aGlzLCJub3RlIik7ZSh0aGlzLCJfbHBmIik7ZSh0aGlzLCJfaHBmIik7ZSh0aGlzLCJfYnBmIik7ZSh0aGlzLCJfY2hvcnVzIik7ZSh0aGlzLCJfY29hcnNlIik7ZSh0aGlzLCJfY3J1c2giKTtlKHRoaXMsIl9kaXN0b3J0Iik7dmFyIGksbixsLHIscCxhLGM7dGhpcy5mcmVxPz8odGhpcy5mcmVxPUEocy5ub3RlKSksdGhpcy5fYmVnaW49cy5fYmVnaW4sdGhpcy5fZHVyYXRpb249cy5fZHVyYXRpb24sdGhpcy5yZWxlYXNlPXMucmVsZWFzZT8/MDtsZXQgdD10aGlzO2lmKE9iamVjdC5hc3NpZ24odCxzKSx0LnM9dC5zPz9vKCJzIiksdC5nYWluPV8odC5nYWluPz9vKCJnYWluIikpLHQudmVsb2NpdHk9Xyh0LnZlbG9jaXR5Pz9vKCJ2ZWxvY2l0eSIpKSx0LnBvc3RnYWluPV8odC5wb3N0Z2Fpbj8/bygicG9zdGdhaW4iKSksdC5kZW5zaXR5PXQuZGVuc2l0eT8/bygiZGVuc2l0eSIpLHQuZmFuY2hvcj10LmZhbmNob3I/P28oImZhbmNob3IiKSx0LmRyaXZlPXQuZHJpdmU/Py42OSx0LnBoYXNlcmRlcHRoPXQucGhhc2VyZGVwdGg/P28oInBoYXNlcmRlcHRoIiksdC5zaGFwZXZvbD1fKHQuc2hhcGV2b2w/P28oInNoYXBldm9sIikpLHQuZGlzdG9ydHZvbD1fKHQuZGlzdG9ydHZvbD8/bygiZGlzdG9ydHZvbCIpKSx0Lmk9dC5pPz9vKCJpIiksdC5jaG9ydXM9dC5jaG9ydXM/P28oImNob3J1cyIpLHQuZmZ0PXQuZmZ0Pz9vKCJmZnQiKSx0LnBhbj10LnBhbj8/bygicGFuIiksdC5vcmJpdD10Lm9yYml0Pz9vKCJvcmJpdCIpLHQuZm1lbnY9dC5mbWVudj8/bygiZm1lbnYiKSx0LnJlc29uYW5jZT10LnJlc29uYW5jZT8/bygicmVzb25hbmNlIiksdC5ocmVzb25hbmNlPXQuaHJlc29uYW5jZT8/bygiaHJlc29uYW5jZSIpLHQuYmFuZHE9dC5iYW5kcT8/bygiYmFuZHEiKSx0LnNwZWVkPXQuc3BlZWQ/P28oInNwZWVkIiksdC5wdz10LnB3Pz9vKCJwdyIpLFt0LmF0dGFjayx0LmRlY2F5LHQuc3VzdGFpbix0LnJlbGVhc2VdPXkoW3QuYXR0YWNrLHQuZGVjYXksdC5zdXN0YWluLHQucmVsZWFzZV0pLHQuX2hvbGRFbmQ9dC5fYmVnaW4rdC5fZHVyYXRpb24sdC5fZW5kPXQuX2hvbGRFbmQrdC5yZWxlYXNlKy4wMSx0LmZtaSYmKHQucz09PSJzYXcifHx0LnM9PT0ic2F3dG9vdGgiKSYmKHQucz0iemF3IiksRFt0LnNdKXtjb25zdCBkPURbdC5zXTt0Ll9zb3VuZD1uZXcgZCx0Ll9jaGFubmVscz0xfWVsc2UgaWYody5zYW1wbGVzLmhhcyh0LnMpKXtjb25zdCBkPXcuc2FtcGxlcy5nZXQodC5zKTt0Ll9idWZmZXJzPVtdLHQuX2NoYW5uZWxzPWQuY2hhbm5lbHMubGVuZ3RoO2ZvcihsZXQgYj0wO2I8dC5fY2hhbm5lbHM7YisrKXQuX2J1ZmZlcnMucHVzaChuZXcgdyhkLmNoYW5uZWxzW2JdLGQuc2FtcGxlUmF0ZSx0LnVuaXQ9PT0iYyIpKX1lbHNlIGNvbnNvbGUud2Fybigic291bmQgbm90IGxvYWRlZCIsdC5zKTt0LnBlbnYmJih0Ll9wZW52PW5ldyB2KHtkZWNheUN1cnZlOjR9KSxbdC5wYXR0YWNrLHQucGRlY2F5LHQucHN1c3RhaW4sdC5wcmVsZWFzZV09eShbdC5wYXR0YWNrLHQucGRlY2F5LHQucHN1c3RhaW4sdC5wcmVsZWFzZV0pKSx0LnZpYiYmKHQuX3ZpYj1uZXcgZyx0LnZpYm1vZD10LnZpYm1vZD8/bygidmlibW9kIikpLHQuZm1pJiYodC5fZm09bmV3IGcsdC5mbWg9dC5mbWg/P28oImZtaCIpLHQuZm1lbnYmJih0Ll9mbWVudj1uZXcgdih7ZGVjYXlDdXJ2ZToyfSksW3QuZm1hdHRhY2ssdC5mbWRlY2F5LHQuZm1zdXN0YWluLHQuZm1yZWxlYXNlXT15KFt0LmZtYXR0YWNrLHQuZm1kZWNheSx0LmZtc3VzdGFpbix0LmZtcmVsZWFzZV0pKSksdC5fYWRzcj1uZXcgdih7ZGVjYXlDdXJ2ZToyfSksdC5kZWxheT1fKHQuZGVsYXk/P28oImRlbGF5IikpLHQuZGVsYXlmZWVkYmFjaz10LmRlbGF5ZmVlZGJhY2s/P28oImRlbGF5ZmVlZGJhY2siKSx0LmRlbGF5c3BlZWQ9dC5kZWxheXNwZWVkPz9vKCJkZWxheXNwZWVkIiksdC5kZWxheXRpbWU9dC5kZWxheXRpbWU/P28oImRlbGF5dGltZSIpLHQubHBlbnYmJih0Ll9scGVudj1uZXcgdih7ZGVjYXlDdXJ2ZTo0fSksW3QubHBhdHRhY2ssdC5scGRlY2F5LHQubHBzdXN0YWluLHQubHByZWxlYXNlXT15KFt0LmxwYXR0YWNrLHQubHBkZWNheSx0Lmxwc3VzdGFpbix0LmxwcmVsZWFzZV0pKSx0LmhwZW52JiYodC5faHBlbnY9bmV3IHYoe2RlY2F5Q3VydmU6NH0pLFt0LmhwYXR0YWNrLHQuaHBkZWNheSx0Lmhwc3VzdGFpbix0LmhwcmVsZWFzZV09eShbdC5ocGF0dGFjayx0LmhwZGVjYXksdC5ocHN1c3RhaW4sdC5ocHJlbGVhc2VdKSksdC5icGVudiYmKHQuX2JwZW52PW5ldyB2KHtkZWNheUN1cnZlOjR9KSxbdC5icGF0dGFjayx0LmJwZGVjYXksdC5icHN1c3RhaW4sdC5icHJlbGVhc2VdPXkoW3QuYnBhdHRhY2ssdC5icGRlY2F5LHQuYnBzdXN0YWluLHQuYnByZWxlYXNlXSkpLHQuX2Nob3J1cz10LmNob3J1cz9bXTpudWxsLHQuX2xwZj10LmN1dG9mZj9bXTpudWxsLHQuX2hwZj10LmhjdXRvZmY/W106bnVsbCx0Ll9icGY9dC5iYW5kZj9bXTpudWxsLHQuX2NvYXJzZT10LmNvYXJzZT9bXTpudWxsLHQuX2NydXNoPXQuY3J1c2g/W106bnVsbCx0Ll9kaXN0b3J0PXQuZGlzdG9ydD9bXTpudWxsO2ZvcihsZXQgZD0wO2Q8dGhpcy5fY2hhbm5lbHM7ZCsrKShpPXQuX2xwZik9PW51bGx8fGkucHVzaChuZXcgcSksKG49dC5faHBmKT09bnVsbHx8bi5wdXNoKG5ldyBxKSwobD10Ll9icGYpPT1udWxsfHxsLnB1c2gobmV3IHEpLChyPXQuX2Nob3J1cyk9PW51bGx8fHIucHVzaChuZXcgWCksKHA9dC5fY29hcnNlKT09bnVsbHx8cC5wdXNoKG5ldyAkKSwoYT10Ll9jcnVzaCk9PW51bGx8fGEucHVzaChuZXcgVSksKGM9dC5fZGlzdG9ydCk9PW51bGx8fGMucHVzaChuZXcgWSl9dXBkYXRlKHMpe2lmKCF0aGlzLl9zb3VuZCYmIXRoaXMuX2J1ZmZlcnMpcmV0dXJuIDA7bGV0IHQ9KyhzPj10aGlzLl9iZWdpbiYmczw9dGhpcy5faG9sZEVuZCksaT10aGlzLmZyZXEqdGhpcy5zcGVlZDtpZih0aGlzLl9mbSYmdGhpcy5mbWghPT12b2lkIDAmJnRoaXMuZm1pIT09dm9pZCAwKXtsZXQgYT10aGlzLmZtaTtpZih0aGlzLl9mbWVudil7Y29uc3QgYj10aGlzLl9mbWVudi51cGRhdGUocyx0LHRoaXMuZm1hdHRhY2ssdGhpcy5mbWRlY2F5LHRoaXMuZm1zdXN0YWluLHRoaXMuZm1yZWxlYXNlKTthPXRoaXMuZm1lbnYqYiphfWNvbnN0IGM9aSp0aGlzLmZtaCxkPWMqYTtpPWkrdGhpcy5fZm0udXBkYXRlKGMpKmR9aWYodGhpcy5fdmliJiZ0aGlzLnZpYm1vZCE9PXZvaWQgMCYmKGk9aSoyKioodGhpcy5fdmliLnVwZGF0ZSh0aGlzLnZpYikqdGhpcy52aWJtb2QvMTIpKSx0aGlzLl9wZW52JiZ0aGlzLnBlbnYhPT12b2lkIDApe2NvbnN0IGE9dGhpcy5fcGVudi51cGRhdGUocyx0LHRoaXMucGF0dGFjayx0aGlzLnBkZWNheSx0aGlzLnBzdXN0YWluLHRoaXMucHJlbGVhc2UpO2k9aSthKnRoaXMucGVudn1sZXQgbj10aGlzLmN1dG9mZjtpZihuIT09dm9pZCAwJiZ0aGlzLl9scGVudil7Y29uc3QgYT10aGlzLl9scGVudi51cGRhdGUocyx0LHRoaXMubHBhdHRhY2ssdGhpcy5scGRlY2F5LHRoaXMubHBzdXN0YWluLHRoaXMubHByZWxlYXNlKTtuPXRoaXMubHBlbnYqYSpuK259bGV0IGw9dGhpcy5oY3V0b2ZmO2lmKGwhPT12b2lkIDAmJnRoaXMuX2hwZW52JiZ0aGlzLmhwZW52IT09dm9pZCAwKXtjb25zdCBhPXRoaXMuX2hwZW52LnVwZGF0ZShzLHQsdGhpcy5ocGF0dGFjayx0aGlzLmhwZGVjYXksdGhpcy5ocHN1c3RhaW4sdGhpcy5ocHJlbGVhc2UpO2w9MioqdGhpcy5ocGVudiphKmwrbH1sZXQgcj10aGlzLmJhbmRmO2lmKHIhPT12b2lkIDAmJnRoaXMuX2JwZW52JiZ0aGlzLmJwZW52IT09dm9pZCAwKXtjb25zdCBhPXRoaXMuX2JwZW52LnVwZGF0ZShzLHQsdGhpcy5icGF0dGFjayx0aGlzLmJwZGVjYXksdGhpcy5icHN1c3RhaW4sdGhpcy5icHJlbGVhc2UpO3I9MioqdGhpcy5icGVudiphKnIrcn1jb25zdCBwPXRoaXMuX2Fkc3IudXBkYXRlKHMsdCx0aGlzLmF0dGFjayx0aGlzLmRlY2F5LHRoaXMuc3VzdGFpbix0aGlzLnJlbGVhc2UpO2ZvcihsZXQgYT0wO2E8dGhpcy5fY2hhbm5lbHM7YSsrKXtpZih0aGlzLl9zb3VuZCYmdGhpcy5zPT09InB1bHNlIj90aGlzLm91dFthXT10aGlzLl9zb3VuZC51cGRhdGUoaSx0aGlzLnB3KTp0aGlzLl9zb3VuZD90aGlzLm91dFthXT10aGlzLl9zb3VuZC51cGRhdGUoaSk6dGhpcy5fYnVmZmVycyYmKHRoaXMub3V0W2FdPXRoaXMuX2J1ZmZlcnNbYV0udXBkYXRlKGkpKSx0aGlzLm91dFthXT10aGlzLm91dFthXSp0aGlzLmdhaW4qdGhpcy52ZWxvY2l0eSx0aGlzLl9jaG9ydXMpe2NvbnN0IGM9dGhpcy5fY2hvcnVzW2FdLnVwZGF0ZSh0aGlzLm91dFthXSx0aGlzLmNob3J1cywuMDMrLjA1KmEsMSwuMTEpO3RoaXMub3V0W2FdPWMrdGhpcy5vdXRbYV19dGhpcy5fbHBmJiYodGhpcy5fbHBmW2FdLnVwZGF0ZSh0aGlzLm91dFthXSxuLHRoaXMucmVzb25hbmNlKSx0aGlzLm91dFthXT10aGlzLl9scGZbYV0uczEpLHRoaXMuX2hwZiYmKHRoaXMuX2hwZlthXS51cGRhdGUodGhpcy5vdXRbYV0sbCx0aGlzLmhyZXNvbmFuY2UpLHRoaXMub3V0W2FdPXRoaXMub3V0W2FdLXRoaXMuX2hwZlthXS5zMSksdGhpcy5fYnBmJiYodGhpcy5fYnBmW2FdLnVwZGF0ZSh0aGlzLm91dFthXSxyLHRoaXMuYmFuZHEpLHRoaXMub3V0W2FdPXRoaXMuX2JwZlthXS5zMCksdGhpcy5fY29hcnNlJiYodGhpcy5vdXRbYV09dGhpcy5fY29hcnNlW2FdLnVwZGF0ZSh0aGlzLm91dFthXSx0aGlzLmNvYXJzZSkpLHRoaXMuX2NydXNoJiYodGhpcy5vdXRbYV09dGhpcy5fY3J1c2hbYV0udXBkYXRlKHRoaXMub3V0W2FdLHRoaXMuY3J1c2gpKSx0aGlzLl9kaXN0b3J0JiYodGhpcy5vdXRbYV09dGhpcy5fZGlzdG9ydFthXS51cGRhdGUodGhpcy5vdXRbYV0sdGhpcy5kaXN0b3J0LHRoaXMuZGlzdG9ydHZvbCkpLHRoaXMub3V0W2FdPXRoaXMub3V0W2FdKnAsdGhpcy5vdXRbYV09dGhpcy5vdXRbYV0qdGhpcy5wb3N0Z2Fpbix0aGlzLl9idWZmZXJzfHwodGhpcy5vdXRbYV09dGhpcy5vdXRbYV0qLjIpfWlmKHRoaXMuX2NoYW5uZWxzPT09MSYmKHRoaXMub3V0WzFdPXRoaXMub3V0WzBdKSx0aGlzLnBhbiE9PS41KXtjb25zdCBhPXRoaXMucGFuKk1hdGguUEkvMjt0aGlzLm91dFswXT10aGlzLm91dFswXSpNYXRoLmNvcyhhKSx0aGlzLm91dFsxXT10aGlzLm91dFsxXSpNYXRoLnNpbihhKX19fWNsYXNzIHN0e2NvbnN0cnVjdG9yKHM9NDhlMyx0PTApe2UodGhpcywidm9pY2VzIixbXSk7ZSh0aGlzLCJ2aWQiLDApO2UodGhpcywicSIsW10pO2UodGhpcywib3V0IixbMCwwXSk7ZSh0aGlzLCJkZWxheXNlbmQiLFswLDBdKTtlKHRoaXMsImRlbGF5dGltZSIsbygiZGVsYXl0aW1lIikpO2UodGhpcywiZGVsYXlmZWVkYmFjayIsbygiZGVsYXlmZWVkYmFjayIpKTtlKHRoaXMsImRlbGF5c3BlZWQiLG8oImRlbGF5c3BlZWQiKSk7ZSh0aGlzLCJ0IiwwKTt0aGlzLnNhbXBsZVJhdGU9cyx0aGlzLnQ9TWF0aC5mbG9vcih0KnMpLHRoaXMuX2RlbGF5TD1uZXcgeCx0aGlzLl9kZWxheVI9bmV3IHh9bG9hZFNhbXBsZShzLHQsaSl7dy5zYW1wbGVzLnNldChzLHtjaGFubmVsczp0LHNhbXBsZVJhdGU6aX0pfXNjaGVkdWxlU3Bhd24ocyl7aWYocy5fYmVnaW49PT12b2lkIDApdGhyb3cgbmV3IEVycm9yKCJbZG91Z2hdOiBzY2hlZHVsZVNwYXduIGV4cGVjdGVkIF9iZWdpbiB0byBiZSBzZXQiKTtpZihzLl9kdXJhdGlvbj09PXZvaWQgMCl0aHJvdyBuZXcgRXJyb3IoIltkb3VnaF06IHNjaGVkdWxlU3Bhd24gZXhwZWN0ZWQgX2R1cmF0aW9uIHRvIGJlIHNldCIpO3Muc2FtcGxlUmF0ZT10aGlzLnNhbXBsZVJhdGU7Y29uc3QgdD1NYXRoLmZsb29yKHMuX2JlZ2luKnRoaXMuc2FtcGxlUmF0ZSk7dGhpcy5zY2hlZHVsZSh7dGltZTp0LHR5cGU6InNwYXduIixhcmc6c30pfXNwYXduKHMpe3MuaWQ9dGhpcy52aWQrKztjb25zdCB0PW5ldyB0dChzKTt0aGlzLnZvaWNlcy5wdXNoKHQpO2NvbnN0IGk9TWF0aC5jZWlsKHQuX2VuZCp0aGlzLnNhbXBsZVJhdGUpO3RoaXMuc2NoZWR1bGUoe3RpbWU6aSx0eXBlOiJkZXNwYXduIixhcmc6dC5pZH0pfWRlc3Bhd24ocyl7dGhpcy52b2ljZXM9dGhpcy52b2ljZXMuZmlsdGVyKHQ9PnQuaWQhPT1zKX1zY2hlZHVsZShzKXtpZighdGhpcy5xLmxlbmd0aCl7dGhpcy5xLnB1c2gocyk7cmV0dXJufWxldCB0PTA7Zm9yKDt0PHRoaXMucS5sZW5ndGgmJnRoaXMucVt0XS50aW1lPHMudGltZTspdCsrO3RoaXMucS5zcGxpY2UodCwwLHMpfXVwZGF0ZSgpe2Zvcig7dGhpcy5xLmxlbmd0aD4wJiZ0aGlzLnFbMF0udGltZTw9dGhpcy50Oyl0aGlzW3RoaXMucVswXS50eXBlXSh0aGlzLnFbMF0uYXJnKSx0aGlzLnEuc2hpZnQoKTt0aGlzLm91dFswXT0wLHRoaXMub3V0WzFdPTA7Zm9yKGxldCBpPTA7aTx0aGlzLnZvaWNlcy5sZW5ndGg7aSsrKXRoaXMudm9pY2VzW2ldLnVwZGF0ZSh0aGlzLnQvdGhpcy5zYW1wbGVSYXRlKSx0aGlzLm91dFswXSs9dGhpcy52b2ljZXNbaV0ub3V0WzBdLHRoaXMub3V0WzFdKz10aGlzLnZvaWNlc1tpXS5vdXRbMV0sdGhpcy52b2ljZXNbaV0uZGVsYXkmJih0aGlzLmRlbGF5c2VuZFswXSs9dGhpcy52b2ljZXNbaV0ub3V0WzBdKnRoaXMudm9pY2VzW2ldLmRlbGF5LHRoaXMuZGVsYXlzZW5kWzFdKz10aGlzLnZvaWNlc1tpXS5vdXRbMV0qdGhpcy52b2ljZXNbaV0uZGVsYXksdGhpcy5kZWxheXRpbWU9dGhpcy52b2ljZXNbaV0uZGVsYXl0aW1lLHRoaXMuZGVsYXlzcGVlZD10aGlzLnZvaWNlc1tpXS5kZWxheXNwZWVkLHRoaXMuZGVsYXlmZWVkYmFjaz10aGlzLnZvaWNlc1tpXS5kZWxheWZlZWRiYWNrKTtjb25zdCBzPXRoaXMuX2RlbGF5TC51cGRhdGUodGhpcy5kZWxheXNlbmRbMF0sdGhpcy5kZWxheXRpbWUpLHQ9dGhpcy5fZGVsYXlSLnVwZGF0ZSh0aGlzLmRlbGF5c2VuZFsxXSx0aGlzLmRlbGF5dGltZSk7dGhpcy5kZWxheXNlbmRbMF09cyp0aGlzLmRlbGF5ZmVlZGJhY2ssdGhpcy5kZWxheXNlbmRbMV09dCp0aGlzLmRlbGF5ZmVlZGJhY2ssdGhpcy5vdXRbMF0rPXMsdGhpcy5vdXRbMV0rPXQsdGhpcy50Kyt9fWNvbnN0IGV0PShoLHMsdCk9Pk1hdGgubWluKE1hdGgubWF4KGgscyksdCk7Y2xhc3MgaXQgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMuZG91Z2g9bmV3IHN0KHNhbXBsZVJhdGUsY3VycmVudFRpbWUpLHRoaXMucG9ydC5vbm1lc3NhZ2U9cz0+e3MuZGF0YS5zcGF3bj90aGlzLmRvdWdoLnNjaGVkdWxlU3Bhd24ocy5kYXRhLnNwYXduKTpzLmRhdGEuc2FtcGxlP3RoaXMuZG91Z2gubG9hZFNhbXBsZShzLmRhdGEuc2FtcGxlLHMuZGF0YS5jaGFubmVscyxzLmRhdGEuc2FtcGxlUmF0ZSk6cy5kYXRhLnNhbXBsZXM/cy5kYXRhLnNhbXBsZXMuZm9yRWFjaCgoW3QsaSxuXSk9Pnt0aGlzLmRvdWdoLmxvYWRTYW1wbGUodCxpLG4pfSk6Y29uc29sZS5sb2coInVucmVjb2duaXplZCBldmVudCB0eXBlIixzLmRhdGEpfX1wcm9jZXNzKHMsdCxpKXtpZih0aGlzLmRpc2Nvbm5lY3RlZClyZXR1cm4hMTtjb25zdCBuPXRbMF07Zm9yKGxldCBsPTA7bDxuWzBdLmxlbmd0aDtsKyspe3RoaXMuZG91Z2gudXBkYXRlKCk7Zm9yKGxldCByPTA7cjxuLmxlbmd0aDtyKyspbltyXVtsXT1ldCh0aGlzLmRvdWdoLm91dFtyXSwtMSwxKX1yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoImRvdWdoLXByb2Nlc3NvciIsaXQpfSkoKTsK", u = typeof sampleRate < "u" ? sampleRate : 48e3, k = Math.PI / u, n = 1 / u;
let N = (a) => Math.pow(a, 2);
function X(a) {
  return N(a);
}
function C(a, t, s) {
  const h = Math.sin((1 - s) * 0.5 * Math.PI), d = Math.sin(s * 0.5 * Math.PI);
  return a * h + t * d;
}
class r {
  phase = 0;
  update(t) {
    const s = Math.sin(this.phase * 2 * Math.PI);
    return this.phase = (this.phase + t / u) % 1, s;
  }
}
class f {
  phase = 0;
  update(t) {
    return this.phase += n * t, this.phase % 1 * 2 - 1;
  }
}
function M(a, t) {
  return a < t ? (a /= t, a + a - a * a - 1) : a > 1 - t ? (a = (a - 1) / t, a * a + a + a + 1) : 0;
}
class V {
  constructor(t = {}) {
    this.phase = t.phase ?? 0;
  }
  update(t) {
    const s = t / u;
    let h = M(this.phase, s), d = 2 * this.phase - 1 - h;
    return this.phase += s, this.phase > 1 && (this.phase -= 1), d;
  }
}
function F(a, t, s) {
  return a < 2 ? 0 : ((d, c, l) => l * (c - d) + d)(-t * 0.5, t * 0.5, s / (a - 1));
}
function v(a, t) {
  return a * Math.pow(2, t / 12);
}
class J {
  constructor(t = {}) {
    this.voices = t.voices ?? 5, this.freqspread = t.freqspread ?? 0.2, this.panspread = t.panspread ?? 0.4, this.phase = new Float32Array(this.voices).map(() => Math.random());
  }
  update(t) {
    const s = Math.sqrt(1 - this.panspread), h = Math.sqrt(this.panspread);
    let d = 0, c = 0;
    for (let l = 0; l < this.voices; l++) {
      const i = v(t, F(this.voices, this.freqspread, l)) / u, o = (l & 1) == 1;
      let G = s;
      o && (G = h);
      let L = M(this.phase[l], i), W = 2 * this.phase[l] - 1 - L;
      d = d + W * G, c = c + W * G, this.phase[l] += i, this.phase[l] > 1 && (this.phase[l] -= 1);
    }
    return d + c;
  }
}
class Y {
  phase = 0;
  update(t) {
    this.phase += n * t;
    let s = this.phase % 1;
    return (s < 0.5 ? 2 * s : 1 - 2 * (s - 0.5)) * 2 - 1;
  }
}
class m {
  s0 = 0;
  s1 = 0;
  update(t, s, h = 0) {
    h = Math.max(h, 0), s = Math.min(s, 2e4);
    const d = 2 * Math.sin(s * k), l = 1 - Math.pow(0.5, (h + 0.125) / 0.125) * d;
    return this.s0 = l * this.s0 - d * this.s1 + d * t, this.s1 = l * this.s1 + d * this.s0, this.s1;
  }
}
class x {
  constructor(t = 0) {
    this.phase = t;
  }
  saw(t, s) {
    let h = (this.phase + t) % 1, d = M(h, s);
    return 2 * h - 1 - d;
  }
  update(t, s = 0.5) {
    const h = t / u;
    let d = this.saw(0, h) - this.saw(s, h);
    return this.phase = (this.phase + h) % 1, d + s * 2 - 1;
  }
}
class g {
  phase = 0;
  update(t, s = 0.5) {
    return this.phase += n * t, this.phase % 1 < s ? 1 : -1;
  }
}
class S {
  update = (t) => Math.random() < t * n ? Math.random() : 0;
}
class T {
  update() {
    return Math.random() * 2 - 1;
  }
}
class P {
  constructor() {
    this.out = 0;
  }
  update() {
    let t = Math.random() * 2 - 1;
    return this.out = (this.out + 0.02 * t) / 1.02, this.out;
  }
}
class j {
  constructor() {
    this.b0 = 0, this.b1 = 0, this.b2 = 0, this.b3 = 0, this.b4 = 0, this.b5 = 0, this.b6 = 0;
  }
  update() {
    const t = Math.random() * 2 - 1;
    this.b0 = 0.99886 * this.b0 + t * 0.0555179, this.b1 = 0.99332 * this.b1 + t * 0.0750759, this.b2 = 0.969 * this.b2 + t * 0.153852, this.b3 = 0.8665 * this.b3 + t * 0.3104856, this.b4 = 0.55 * this.b4 + t * 0.5329522, this.b5 = -0.7616 * this.b5 - t * 0.016898;
    const s = this.b0 + this.b1 + this.b2 + this.b3 + this.b4 + this.b5 + this.b6 + t * 0.5362;
    return this.b6 = t * 0.115926, s * 0.11;
  }
}
class Q {
  phase = 1;
  update(t) {
    this.phase += n * t;
    let s = this.phase >= 1 ? 1 : 0;
    return this.phase = this.phase % 1, s;
  }
}
class ts {
  inSgn = !0;
  outSgn = !0;
  clockCnt = 0;
  update(t, s) {
    let h = t > 0;
    return this.inSgn != h && (this.clockCnt++, this.clockCnt >= s && (this.clockCnt = 0, this.outSgn = !this.outSgn)), this.inSgn = h, this.outSgn ? 1 : -1;
  }
}
class hs {
  value = 0;
  trigSgn = !1;
  update(t, s) {
    return !this.trigSgn && s > 0 && (this.value = t), this.trigSgn = s > 0, this.value;
  }
}
function z(a, t, s, h = 1) {
  if (a <= 0) return t;
  if (a >= 1) return s;
  let d;
  return h === 0 ? d = a : h > 0 ? d = Math.pow(a, h) : d = 1 - Math.pow(1 - a, -h), t + (s - t) * d;
}
class Z {
  constructor(t = {}) {
    this.state = "off", this.startTime = 0, this.startVal = 0, this.decayCurve = t.decayCurve ?? 1;
  }
  update(t, s, h, d, c, l) {
    switch (this.state) {
      case "off":
        return s > 0 && (this.state = "attack", this.startTime = t, this.startVal = 0), 0;
      case "attack": {
        let p = t - this.startTime;
        return p > h ? (this.state = "decay", this.startTime = t, 1) : z(p / h, this.startVal, 1, 1);
      }
      case "decay": {
        let p = t - this.startTime, i = z(p / d, 1, c, -this.decayCurve);
        return s <= 0 ? (this.state = "release", this.startTime = t, this.startVal = i, i) : p > d ? (this.state = "sustain", this.startTime = t, c) : i;
      }
      case "sustain":
        return s <= 0 && (this.state = "release", this.startTime = t, this.startVal = c), c;
      case "release": {
        let p = t - this.startTime;
        if (p > l)
          return this.state = "off", 0;
        let i = z(p / l, this.startVal, 0, -this.decayCurve);
        return s > 0 && (this.state = "attack", this.startTime = t, this.startVal = i), i;
      }
    }
    throw "invalid envelope state";
  }
}
const w = 10;
class as {
  lpf = new m();
  constructor(t = {}) {
    this.buffer = new Float32Array(w * u), this.writeIdx = 0, this.readIdx = 0, this.numSamples = 0;
  }
  write(t, s) {
    this.numSamples = Math.min(Math.floor(u * s), this.buffer.length - 1), this.writeIdx = (this.writeIdx + 1) % this.numSamples, this.buffer[this.writeIdx] = t, this.readIdx = this.writeIdx - this.numSamples + 1, this.readIdx < 0 && (this.readIdx += this.numSamples);
  }
  update(t, s, h = 1) {
    this.write(t, s);
    let d = this.readIdx;
    return h < 0 ? d = this.numSamples - Math.floor(Math.abs(this.readIdx * h) % this.numSamples) : d = Math.floor(this.readIdx * h) % this.numSamples, this.lpf.update(this.buffer[d], 0.9, 0);
  }
}
class R {
  writeIdx = 0;
  readIdx = 0;
  buffer = new Float32Array(w * u);
  //.fill(0)
  write(t, s) {
    this.writeIdx = (this.writeIdx + 1) % this.buffer.length, this.buffer[this.writeIdx] = t;
    let h = Math.min(Math.floor(u * s), this.buffer.length - 1);
    this.readIdx = this.writeIdx - h, this.readIdx < 0 && (this.readIdx += this.buffer.length);
  }
  update(t, s) {
    return this.write(t, s), this.buffer[this.readIdx];
  }
}
class B {
  delay = new R();
  modulator = new Y();
  update(t, s, h, d, c) {
    const l = this.modulator.update(d) * c, p = this.delay.update(t, h * (1 + l));
    return C(t, p, s);
  }
}
class is {
  update(t = 0, s = 0) {
    return s < 0 && (s = 0), s = s + 1, t = t * s, 4 * (Math.abs(0.25 * t + 0.25 - Math.round(0.25 * t + 0.25)) - 0.25);
  }
}
class ds {
  lagUnit = 4410;
  s = 0;
  update(t, s) {
    return s = s * this.lagUnit, s < 1 && (s = 1), this.s += 1 / s * (t - this.s), this.s;
  }
}
class ls {
  last = 0;
  update(t, s, h) {
    const d = s * n, c = h * n;
    let l = t - this.last;
    return l > d ? l = d : l < -c && (l = -c), this.last += l, this.last;
  }
}
function es(a, t) {
  t = Math.min(Math.max(t, 0), 1), t -= 0.01;
  var s = 2 * t / (1 - t), h = (1 + s) * a / (1 + s * Math.abs(a));
  return h;
}
class cs {
  clockSgn = !0;
  step = 0;
  first = !0;
  update(t, ...s) {
    return !this.clockSgn && t > 0 ? (this.step = (this.step + 1) % s.length, this.clockSgn = t > 0, 0) : (this.clockSgn = t > 0, s[this.step]);
  }
}
class U {
  hold = 0;
  t = 0;
  update(t, s) {
    return this.t++ % s === 0 && (this.t = 0, this.hold = t), this.hold;
  }
}
class D {
  update(t, s) {
    s = Math.max(1, s);
    const h = Math.pow(2, s - 1);
    return Math.round(t * h) / h;
  }
}
class _ {
  update(t, s = 0, h = 1) {
    h = Math.max(1e-3, Math.min(1, h));
    const d = Math.expm1(s);
    return (1 + d) * t / (1 + d * Math.abs(t)) * h;
  }
}
class y {
  static samples = /* @__PURE__ */ new Map();
  // string -> { channels, sampleRate }
  buffer;
  // Float32Array
  sampleRate;
  pos = 0;
  sampleFreq = I();
  constructor(t, s, h) {
    this.buffer = t, this.sampleRate = s, this.duration = this.buffer.length / this.sampleRate, this.speed = u / this.sampleRate, h && (this.speed *= this.duration);
  }
  update(t) {
    if (this.pos >= this.buffer.length)
      return 0;
    const s = t / this.sampleFreq * this.speed;
    let h = this.buffer[Math.floor(this.pos)];
    return this.pos = this.pos + s, h;
  }
}
function ps(a, t, s) {
  let h = Math.log(t), d = Math.log(s) - h;
  const c = (a + 1) / 2;
  return Math.exp(c * d + h);
}
const b = (a, t = "linear", s) => {
  const [l, p, i, o] = a;
  if (l == null && p == null && i == null && o == null)
    return s ?? [1e-3, 1e-3, 1, 0.01];
  const G = i ?? (l != null && p == null || l == null && p == null ? 1 : 1e-3);
  return [Math.max(l ?? 0, 1e-3), Math.max(p ?? 0, 1e-3), Math.min(G, 1), Math.max(o ?? 0, 0.01)];
};
let K = {
  sine: r,
  saw: V,
  zaw: f,
  sawtooth: V,
  zawtooth: f,
  supersaw: J,
  tri: Y,
  triangle: Y,
  pulse: x,
  square: x,
  pulze: g,
  dust: S,
  crackle: S,
  impulse: Q,
  white: T,
  brown: P,
  pink: j
};
const O = {
  chorus: 0,
  note: 48,
  s: "triangle",
  bank: "",
  gain: 1,
  postgain: 1,
  velocity: 1,
  density: ".03",
  ftype: "12db",
  fanchor: 0,
  //resonance: 1, // superdough resonance is scaled differently
  resonance: 0,
  //hresonance: 1, // superdough resonance is scaled differently
  hresonance: 0,
  // bandq: 1,  // superdough resonance is scaled differently
  bandq: 0,
  channels: [1, 2],
  phaserdepth: 0.75,
  shapevol: 1,
  distortvol: 1,
  delay: 0,
  byteBeatExpression: "0",
  delayfeedback: 0.5,
  delayspeed: 1,
  delaytime: 0.25,
  orbit: 1,
  i: 1,
  fft: 8,
  z: "triangle",
  pan: 0.5,
  fmh: 1,
  fmenv: 0,
  // differs from superdough
  speed: 1,
  pw: 0.5
};
let e = (a) => O[a];
const E = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }, A = { "#": 1, b: -1, s: 1, f: -1 }, q = (a, t = 3) => {
  let [s, h = "", d = ""] = String(a).match(/^([a-gA-G])([#bsf]*)([0-9]*)$/)?.slice(1) || [];
  if (!s)
    throw new Error('not a note: "' + a + '"');
  const c = E[s.toLowerCase()], l = h?.split("").reduce((i, o) => i + A[o], 0) || 0;
  return (Number(d || t) + 1) * 12 + c + l;
}, $ = (a) => Math.pow(2, (a - 69) / 12) * 440, I = (a) => (a = a || e("note"), typeof a == "string" && (a = q(a, 3)), $(a));
class ss {
  /** @type {number} */
  id = 0;
  /** @type {number[]} */
  out = [0, 0];
  /** @type {number | undefined} */
  attack;
  /** @type {number | undefined} */
  decay;
  /** @type {number | undefined} */
  sustain;
  /** @type {number} */
  release;
  /** @type {number} */
  _begin;
  /** @type {number} */
  _duration;
  /** @type {any} */
  _sound;
  /** @type {number} */
  _channels = 1;
  /** @type {BufferPlayer[] | undefined} */
  _buffers;
  /** @type {string | undefined} */
  unit;
  /** @type {ADSR | undefined} */
  _penv;
  /** @type {number | undefined} */
  penv;
  /** @type {number | undefined} */
  pattack;
  /** @type {number | undefined} */
  pdecay;
  /** @type {number | undefined} */
  psustain;
  /** @type {number | undefined} */
  prelease;
  /** @type {number | undefined} */
  vib;
  _vib;
  /** @type {number | undefined} */
  vibmod;
  /** @type {SineOsc | undefined} */
  _fm;
  /** @type {number | undefined} */
  fmh;
  /** @type {number | undefined} */
  fmi;
  /** @type {ADSR | undefined} */
  _fmenv;
  /** @type {number | undefined} */
  fmattack;
  /** @type {number | undefined} */
  fmdecay;
  /** @type {number | undefined} */
  fmsustain;
  /** @type {number | undefined} */
  fmrelease;
  /** @type {ADSR | undefined} */
  _lpenv;
  lpenv;
  /** @type {number | undefined} */
  lpattack;
  /** @type {number | undefined} */
  lpdecay;
  /** @type {number | undefined} */
  lpsustain;
  /** @type {number | undefined} */
  lprelease;
  /** @type {ADSR | undefined} */
  _hpenv;
  /** @type {number | undefined} */
  hpenv;
  /** @type {number | undefined} */
  hpattack;
  /** @type {number | undefined} */
  hpdecay;
  /** @type {number | undefined} */
  hpsustain;
  /** @type {number | undefined} */
  hprelease;
  /** @type {ADSR | undefined} */
  _bpenv;
  /** @type {number | undefined} */
  bpenv;
  /** @type {number | undefined} */
  bpattack;
  /** @type {number | undefined} */
  bpdecay;
  /** @type {number | undefined} */
  bpsustain;
  /** @type {number | undefined} */
  bprelease;
  /** @type {number | undefined} */
  cutoff;
  /** @type {number | undefined} */
  hcutoff;
  /** @type {number | undefined} */
  bandf;
  /** @type {number | undefined} */
  coarse;
  /** @type {number | undefined} */
  crush;
  /** @type {number | undefined} */
  distort;
  /** @type {number} */
  freq;
  /** @type {string | undefined} */
  note;
  /** @type {TwoPoleFilter[] | null | undefined} */
  _lpf;
  /** @type {TwoPoleFilter[] | null | undefined} */
  _hpf;
  /** @type {TwoPoleFilter[] | null | undefined} */
  _bpf;
  /** @type {Chorus[] | null | undefined} */
  _chorus;
  /** @type {Coarse[] | null | undefined} */
  _coarse;
  /** @type {Crush[] | null | undefined} */
  _crush;
  /** @type {Distort[] | null | undefined} */
  _distort;
  /**
   * @param {DoughVoice} value
   */
  constructor(t) {
    this.freq ??= I(t.note), this._begin = t._begin, this._duration = t._duration, this.release = t.release ?? 0;
    let s = this;
    if (Object.assign(s, t), s.s = s.s ?? e("s"), s.gain = X(s.gain ?? e("gain")), s.velocity = X(s.velocity ?? e("velocity")), s.postgain = X(s.postgain ?? e("postgain")), s.density = s.density ?? e("density"), s.fanchor = s.fanchor ?? e("fanchor"), s.drive = s.drive ?? 0.69, s.phaserdepth = s.phaserdepth ?? e("phaserdepth"), s.shapevol = X(s.shapevol ?? e("shapevol")), s.distortvol = X(s.distortvol ?? e("distortvol")), s.i = s.i ?? e("i"), s.chorus = s.chorus ?? e("chorus"), s.fft = s.fft ?? e("fft"), s.pan = s.pan ?? e("pan"), s.orbit = s.orbit ?? e("orbit"), s.fmenv = s.fmenv ?? e("fmenv"), s.resonance = s.resonance ?? e("resonance"), s.hresonance = s.hresonance ?? e("hresonance"), s.bandq = s.bandq ?? e("bandq"), s.speed = s.speed ?? e("speed"), s.pw = s.pw ?? e("pw"), [s.attack, s.decay, s.sustain, s.release] = b([s.attack, s.decay, s.sustain, s.release]), s._holdEnd = s._begin + s._duration, s._end = s._holdEnd + s.release + 0.01, s.fmi && (s.s === "saw" || s.s === "sawtooth") && (s.s = "zaw"), K[s.s]) {
      const h = K[s.s];
      s._sound = new h(), s._channels = 1;
    } else if (y.samples.has(s.s)) {
      const h = y.samples.get(s.s);
      s._buffers = [], s._channels = h.channels.length;
      for (let d = 0; d < s._channels; d++)
        s._buffers.push(new y(h.channels[d], h.sampleRate, s.unit === "c"));
    } else
      console.warn("sound not loaded", s.s);
    s.penv && (s._penv = new Z({ decayCurve: 4 }), [s.pattack, s.pdecay, s.psustain, s.prelease] = b([s.pattack, s.pdecay, s.psustain, s.prelease])), s.vib && (s._vib = new r(), s.vibmod = s.vibmod ?? e("vibmod")), s.fmi && (s._fm = new r(), s.fmh = s.fmh ?? e("fmh"), s.fmenv && (s._fmenv = new Z({ decayCurve: 2 }), [s.fmattack, s.fmdecay, s.fmsustain, s.fmrelease] = b([s.fmattack, s.fmdecay, s.fmsustain, s.fmrelease]))), s._adsr = new Z({ decayCurve: 2 }), s.delay = X(s.delay ?? e("delay")), s.delayfeedback = s.delayfeedback ?? e("delayfeedback"), s.delayspeed = s.delayspeed ?? e("delayspeed"), s.delaytime = s.delaytime ?? e("delaytime"), s.lpenv && (s._lpenv = new Z({ decayCurve: 4 }), [s.lpattack, s.lpdecay, s.lpsustain, s.lprelease] = b([s.lpattack, s.lpdecay, s.lpsustain, s.lprelease])), s.hpenv && (s._hpenv = new Z({ decayCurve: 4 }), [s.hpattack, s.hpdecay, s.hpsustain, s.hprelease] = b([s.hpattack, s.hpdecay, s.hpsustain, s.hprelease])), s.bpenv && (s._bpenv = new Z({ decayCurve: 4 }), [s.bpattack, s.bpdecay, s.bpsustain, s.bprelease] = b([s.bpattack, s.bpdecay, s.bpsustain, s.bprelease])), s._chorus = s.chorus ? [] : null, s._lpf = s.cutoff ? [] : null, s._hpf = s.hcutoff ? [] : null, s._bpf = s.bandf ? [] : null, s._coarse = s.coarse ? [] : null, s._crush = s.crush ? [] : null, s._distort = s.distort ? [] : null;
    for (let h = 0; h < this._channels; h++)
      s._lpf?.push(new m()), s._hpf?.push(new m()), s._bpf?.push(new m()), s._chorus?.push(new B()), s._coarse?.push(new U()), s._crush?.push(new D()), s._distort?.push(new _());
  }
  update(t) {
    if (!this._sound && !this._buffers)
      return 0;
    let s = +(t >= this._begin && t <= this._holdEnd), h = this.freq * this.speed;
    if (this._fm && this.fmh !== void 0 && this.fmi !== void 0) {
      let i = this.fmi;
      if (this._fmenv) {
        const L = this._fmenv.update(t, s, this.fmattack, this.fmdecay, this.fmsustain, this.fmrelease);
        i = this.fmenv * L * i;
      }
      const o = h * this.fmh, G = o * i;
      h = h + this._fm.update(o) * G;
    }
    if (this._vib && this.vibmod !== void 0 && (h = h * 2 ** (this._vib.update(this.vib) * this.vibmod / 12)), this._penv && this.penv !== void 0) {
      const i = this._penv.update(t, s, this.pattack, this.pdecay, this.psustain, this.prelease);
      h = h + i * this.penv;
    }
    let d = this.cutoff;
    if (d !== void 0 && this._lpenv) {
      const i = this._lpenv.update(t, s, this.lpattack, this.lpdecay, this.lpsustain, this.lprelease);
      d = this.lpenv * i * d + d;
    }
    let c = this.hcutoff;
    if (c !== void 0 && this._hpenv && this.hpenv !== void 0) {
      const i = this._hpenv.update(t, s, this.hpattack, this.hpdecay, this.hpsustain, this.hprelease);
      c = 2 ** this.hpenv * i * c + c;
    }
    let l = this.bandf;
    if (l !== void 0 && this._bpenv && this.bpenv !== void 0) {
      const i = this._bpenv.update(t, s, this.bpattack, this.bpdecay, this.bpsustain, this.bprelease);
      l = 2 ** this.bpenv * i * l + l;
    }
    const p = this._adsr.update(t, s, this.attack, this.decay, this.sustain, this.release);
    for (let i = 0; i < this._channels; i++) {
      if (this._sound && this.s === "pulse" ? this.out[i] = this._sound.update(h, this.pw) : this._sound ? this.out[i] = this._sound.update(h) : this._buffers && (this.out[i] = this._buffers[i].update(h)), this.out[i] = this.out[i] * this.gain * this.velocity, this._chorus) {
        const o = this._chorus[i].update(this.out[i], this.chorus, 0.03 + 0.05 * i, 1, 0.11);
        this.out[i] = o + this.out[i];
      }
      this._lpf && (this._lpf[i].update(this.out[i], d, this.resonance), this.out[i] = this._lpf[i].s1), this._hpf && (this._hpf[i].update(this.out[i], c, this.hresonance), this.out[i] = this.out[i] - this._hpf[i].s1), this._bpf && (this._bpf[i].update(this.out[i], l, this.bandq), this.out[i] = this._bpf[i].s0), this._coarse && (this.out[i] = this._coarse[i].update(this.out[i], this.coarse)), this._crush && (this.out[i] = this._crush[i].update(this.out[i], this.crush)), this._distort && (this.out[i] = this._distort[i].update(this.out[i], this.distort, this.distortvol)), this.out[i] = this.out[i] * p, this.out[i] = this.out[i] * this.postgain, this._buffers || (this.out[i] = this.out[i] * 0.2);
    }
    if (this._channels === 1 && (this.out[1] = this.out[0]), this.pan !== 0.5) {
      const i = this.pan * Math.PI / 2;
      this.out[0] = this.out[0] * Math.cos(i), this.out[1] = this.out[1] * Math.sin(i);
    }
  }
}
class os {
  voices = [];
  // DoughVoice[]
  vid = 0;
  q = [];
  out = [0, 0];
  delaysend = [0, 0];
  delaytime = e("delaytime");
  delayfeedback = e("delayfeedback");
  delayspeed = e("delayspeed");
  t = 0;
  // sampleRate: number, currentTime: number (seconds)
  constructor(t = 48e3, s = 0) {
    this.sampleRate = t, this.t = Math.floor(s * t), this._delayL = new R(), this._delayR = new R();
  }
  loadSample(t, s, h) {
    y.samples.set(t, { channels: s, sampleRate: h });
  }
  scheduleSpawn(t) {
    if (t._begin === void 0)
      throw new Error("[dough]: scheduleSpawn expected _begin to be set");
    if (t._duration === void 0)
      throw new Error("[dough]: scheduleSpawn expected _duration to be set");
    t.sampleRate = this.sampleRate;
    const s = Math.floor(t._begin * this.sampleRate);
    this.schedule({ time: s, type: "spawn", arg: t });
  }
  spawn(t) {
    t.id = this.vid++;
    const s = new ss(t);
    this.voices.push(s);
    const h = Math.ceil(s._end * this.sampleRate);
    this.schedule({ time: h, type: "despawn", arg: s.id });
  }
  despawn(t) {
    this.voices = this.voices.filter((s) => s.id !== t);
  }
  // schedules a function call with a single argument
  // msg = {time:number,type:string, arg: any}
  // the Dough method "type" will be called with "arg" at "time"
  schedule(t) {
    if (!this.q.length) {
      this.q.push(t);
      return;
    }
    let s = 0;
    for (; s < this.q.length && this.q[s].time < t.time; )
      s++;
    this.q.splice(s, 0, t);
  }
  // maybe update should be called once per block instead for perf reasons?
  update() {
    for (; this.q.length > 0 && this.q[0].time <= this.t; )
      this[this.q[0].type](this.q[0].arg), this.q.shift();
    this.out[0] = 0, this.out[1] = 0;
    for (let h = 0; h < this.voices.length; h++)
      this.voices[h].update(this.t / this.sampleRate), this.out[0] += this.voices[h].out[0], this.out[1] += this.voices[h].out[1], this.voices[h].delay && (this.delaysend[0] += this.voices[h].out[0] * this.voices[h].delay, this.delaysend[1] += this.voices[h].out[1] * this.voices[h].delay, this.delaytime = this.voices[h].delaytime, this.delayspeed = this.voices[h].delayspeed, this.delayfeedback = this.voices[h].delayfeedback);
    const t = this._delayL.update(this.delaysend[0], this.delaytime), s = this._delayR.update(this.delaysend[1], this.delaytime);
    this.delaysend[0] = t * this.delayfeedback, this.delaysend[1] = s * this.delayfeedback, this.out[0] += t, this.out[1] += s, this.t++;
  }
}
const us = H;
export {
  Z as ADSR,
  P as BrownNoise,
  y as BufferPlayer,
  B as Chorus,
  ts as ClockDiv,
  U as Coarse,
  D as Crush,
  R as Delay,
  _ as Distort,
  os as Dough,
  ss as DoughVoice,
  S as Dust,
  is as Fold,
  hs as Hold,
  Q as Impulse,
  ds as Lag,
  j as PinkNoise,
  as as PitchDelay,
  g as PulzeOsc,
  V as SawOsc,
  cs as Sequence,
  r as SineOsc,
  ls as Slew,
  J as SupersawOsc,
  Y as TriOsc,
  m as TwoPoleFilter,
  T as WhiteNoise,
  f as ZawOsc,
  ps as _rangex,
  es as applyDistortion,
  b as getADSR,
  us as workletUrl
};
