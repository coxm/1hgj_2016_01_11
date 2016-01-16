# === Images === #
montage_options+= -background none
montage_options+= -geometry +0+0

define do_montage
mkdir -p `dirname "$@"`
montage $+ $(montage_options) -size 64x64 $@
endef


.PHONY: spritesheets
spritesheets: app/img/slap.png
	

app/img/slap.png: assets/png/*.png
	$(do_montage)
